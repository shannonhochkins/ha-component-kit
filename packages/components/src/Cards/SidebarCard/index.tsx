import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";
import { Icon } from "@iconify/react";
import { useStore } from "@hakit/core";
import { TimeCard, WeatherCard, Row, Column, fallback, mq, useBreakpoint } from "@components";
import type { WeatherCardProps, TimeCardProps } from "@components";
import { ErrorBoundary } from "react-error-boundary";

const StyledTimeCard = styled(TimeCard)<{
  open: boolean;
}>`
  padding: 0;
  background: transparent;
  width: 100%;
  box-shadow: none;
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: padding;
  border-radius: 0;
  &:hover {
    box-shadow: none;
    background: transparent;
  }
  &:not(.disabled):not(:disabled):not(:focus):hover {
    box-shadow: none;
    background: transparent;
    color: var(--ha-S200-contrast) svg {
      color: var(--ha-S200-contrast);
    }
  }
  .time,
  .time-suffix {
    transition: var(--ha-transition-duration) var(--ha-easing);
    transition-property: font-size;
  }
  ${(props) =>
    !props.open &&
    `
    padding: 0.5rem 0;
    .time, .time-suffix {
      font-size: 0.7rem;
    }
  `}
`;

const StyledSidebarCard = styled.div`
  background-color: var(--ha-S50);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  height: 100%;
  justify-content: flex-start;
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: left, max-width, width;
  transform-origin: left center;
  gap: 1rem;
  > * {
    transition: var(--ha-transition-duration) var(--ha-easing);
    transition-property: padding;
  }
  ${mq(
    ["xxs", "xs"],
    `
    position: fixed;
    top: 0;
    bottom: 0;
    left: var(--ha-sidebar-offset);
    z-index: calc(var(--ha-device-area-card-z-index) - 1);
  `,
  )}
`;

const Menu = styled.ul<{
  open: boolean;
}>`
  padding: 0;
  margin: 1rem 0 0 0;
  width: 100%;
  li {
    position: relative;
    list-style-type: none;
    a {
      position: relative;
      cursor: pointer;
      user-select: none;
      position: relative;
      cursor: pointer;
      user-select: none;
      height: 3rem;
      text-decoration: none;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: row;
      padding: 0.5rem 0rem 0.5rem 1rem;
      gap: 1rem;

      &:hover {
        background: transparent;
      }
      svg {
        display: inline-block;
        margin: 0;
        text-align: left;
        font-size: 1.5rem;
      }
      > .menu-inner {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;
      }
      span {
        display: block;
        width: 100%;
        font-size: 0.7rem;
        font-weight: 300;
        color: var(--ha-S100-contrast);
      }
    }
  }
  li {
    > a {
      color: var(--ha-S100-contrast);
      background-color: transparent;
      transition: var(--ha-transition-duration) var(--ha-easing);
      transition-property: color, background-color;
      svg {
        color: var(--ha-S100-contrast);
        transition: var(--ha-transition-duration) var(--ha-easing);
        transition-property: color;
      }
    }
    &:hover,
    &.active,
    &:focus {
      > a {
        color: var(--ha-A400);
        background-color: var(--ha-S100);

        svg {
          color: var(--ha-A400);
        }
      }
    }
  }
  ${(props) =>
    !props.open &&
    `
    margin: 0;
    li {
      a {
        padding: 0;
        justify-content: center;
        svg {
          margin: 0;
        }
      }
    }
  `}
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--ha-S200);
  margin: 0;
`;

const HamburgerMenu = styled(Menu)`
  margin: 0;
  li {
    a {
      justify-content: center;
      padding: 0.7rem;
      svg {
        margin: 0;
      }
    }
  }

  ${mq(
    ["xxs", "xs"],
    `
    left: 0;
    top: 0;
    li {
      a {
        background-color: transparent;
      }
    }
  `,
  )}
`;

const Filler = styled.div`
  width: 100%;
  height: 100%;
`;

const StyledWeatherCard = styled(WeatherCard)`
  background: transparent;
  width: 100%;
  padding: 0;
  border-radius: 0;
  box-shadow: none;
  &:hover {
    box-shadow: none;
    background: transparent;
  }
`;

const WeatherCardCustom = styled(StyledWeatherCard)<{
  open: boolean;
}>`
  padding-bottom: 1rem;
  border-radius: 0;
  ${(props) =>
    !props.open &&
    `
    div > * {
      display: none;
    }
    div > svg {
      display: flex;
    }
  `}
`;
export interface MenuItem {
  /** The title of the menu item */
  title: string;
  /** the description, this will appear below the title */
  description?: string;
  /** the icon name or JSX element, eg <Icon icon="mdi:cross" /> */
  icon: React.ReactNode | string;
  /** the hash name of the menu item, this is optional */
  hash?: string;
  /** if the item is active or not */
  active: boolean;
  /** onClick action to fire when the menu item is clicked  */
  onClick: (event: React.MouseEvent<HTMLLIElement>) => void;
}
export interface SidebarCardProps extends React.ComponentProps<"div"> {
  /** should the time card be included by default @default true */
  includeTimeCard?: boolean;
  /** should the sidebar start opened,  True by default if collapsible=false @default true */
  startOpen?: boolean;
  /** Whether the sidebar can be collapsed by the end-user @default true */
  collapsible?: boolean;
  /** the props for the weather card , if omitted, weather card is not rendered @default undefined */
  weatherCardProps?: WeatherCardProps;
  /** Adding menu items can also add routes by default, disabled this if need be @default true */
  autoIncludeRoutes?: boolean;
  /** the props for the timeCard @default { hideIcon: true, hideIcon: true, center: true }*/
  timeCardProps?: TimeCardProps;
  /** the menu items to add to the sidebar @default [] */
  menuItems?: MenuItem[];
  /** the children to render in the sidebar */
  children?: React.ReactNode;
  /** a method to apply a sort function to the sidebar menu items before they render */
  sortSidebarMenuItems?: (a: MenuItem, b: MenuItem) => number;
}
function InternalSidebarCard({
  weatherCardProps,
  timeCardProps = {
    hideIcon: true,
    hideDate: true,
    center: true,
  },
  startOpen = true,
  collapsible = true,
  menuItems = [],
  children,
  autoIncludeRoutes = true,
  includeTimeCard = true,
  className,
  cssStyles,
  sortSidebarMenuItems,
  key,
  style,
  ...rest
}: SidebarCardProps) {
  const [open, setOpen] = useState(startOpen);
  const routes = useStore((state) => state.routes);
  const hash = useStore((state) => state.hash);
  const devices = useBreakpoint();
  const concatenatedMenuItems = useMemo<MenuItem[]>(() => {
    const mappedRoutes = routes.map<MenuItem>((route) => ({
      ...route,
      title: route.name,
      onClick() {
        if (!route.active) {
          location.hash = "";
          setTimeout(
            () => {
              location.hash = route.hash;
            },
            hash === "" ? 0 : 450,
          );
        }
      },
    }));
    const items = autoIncludeRoutes ? [...menuItems, ...mappedRoutes] : menuItems;
    if (typeof sortSidebarMenuItems === "function") {
      items.sort(sortSidebarMenuItems);
    }
    return items;
  }, [routes, sortSidebarMenuItems, autoIncludeRoutes, menuItems, hash]);
  return (
    <>
      <Global
        styles={css`
          :root {
            --ha-area-card-expanded-offset: ${devices.xxs || devices.xs
              ? "0rem"
              : open
                ? `var(--ha-device-sidebar-card-width-expanded, 19rem)`
                : `var(--ha-device-sidebar-card-width-collapsed, 5rem)`};
            --ha-sidebar-max-width: ${open
              ? `var(--ha-device-sidebar-card-width-expanded, 19rem)`
              : `var(--ha-device-sidebar-card-width-collapsed, 5rem)`};
            --ha-sidebar-offset: ${open ? `0` : `calc(var(--ha-sidebar-max-width) * -1)`};
          }
        `}
      />
      <StyledSidebarCard
        key={key ?? `ha-sidebar-closed`}
        css={css`
          ${cssStyles ?? ""}
        `}
        className={`${className ?? ""} sidebar-card`}
        style={{
          ...style,
          width: "100%",
          maxWidth: open ? `var(--ha-device-sidebar-card-width-expanded, 19rem)` : `var(--ha-device-sidebar-card-width-collapsed, 5rem)`,
        }}
        {...rest}
      >
        <Column className="column" wrap="nowrap" fullHeight fullWidth alignItems="flex-start" justifyContent="space-between">
          <Filler className="filler">
            <Row
              className="row"
              wrap="nowrap"
              style={{
                padding: open ? "0.28rem 0" : "0",
                flexDirection: open ? "row" : "column",
              }}
            >
              {includeTimeCard && (
                <StyledTimeCard disableColumns key="sidebar-large-time-card" className="sidebar-time-card" open={open} {...timeCardProps} />
              )}
              {collapsible && (
                <HamburgerMenu
                  open={open}
                  className="hamburger-menu"
                  key="hamburger-menu-open"
                  style={{
                    width: devices.xxs || devices.xs ? "auto" : !open ? "100%" : "40%",
                    position: devices.xxs || devices.xs ? "fixed" : "relative",
                  }}
                >
                  <li
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpen(!open);
                    }}
                  >
                    <a
                      style={{
                        justifyContent: "center",
                      }}
                    >
                      <Icon className="icon" icon={open ? "mdi:close" : "mdi:menu"} />
                    </a>
                  </li>
                </HamburgerMenu>
              )}
            </Row>
            <Divider className="divider" />
            <Menu open={open} className="menu">
              {concatenatedMenuItems.map((item, index) => {
                return (
                  <li
                    onClick={(event) => {
                      event.stopPropagation();
                      item.onClick(event);
                    }}
                    key={index}
                    className={item.active ? "active" : "inactive"}
                  >
                    <a>
                      {typeof item.icon === "string" ? <Icon className="icon" icon={item.icon} /> : item.icon}
                      {open && (
                        <div className="menu-inner">
                          {item.title}
                          {item.description && <span>{item.description}</span>}
                        </div>
                      )}
                    </a>
                  </li>
                );
              })}
            </Menu>
            {children && open && <Filler className="filler">{children}</Filler>}
          </Filler>
          {weatherCardProps && (
            <div
              className="weather-wrapper"
              key="sidebar-weather-large"
              style={{
                width: "100%",
                padding: open ? "0 1rem 1rem" : "0",
              }}
            >
              <WeatherCardCustom disableColumns className="weather-card-sidebar" open={open} {...weatherCardProps} />
            </div>
          )}
        </Column>
      </StyledSidebarCard>
    </>
  );
}
/** This component is a nice way of organizing components / groups into an easy to navigate sidebar, the "Area Cards" will automatically insert into the sidebar items if they're present on the page, eg if you have 6 AreaCards, all 6 items will be added to the sidebar automatically, you can also add your own menu items to the start of the list, this all needs a bit more thought but for now it is pretty useful! The TimeCard and WeatherCard are integrate and themed slightly different in the sidebar, if the sidebar is present, the AreaCard will only expand to the available space and not cover the sidebar */
export function SidebarCard(props: SidebarCardProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "SidebarCard" })}>
      <InternalSidebarCard {...props} />
    </ErrorBoundary>
  );
}
