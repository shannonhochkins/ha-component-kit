import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { css, Global } from "@emotion/react";
import { Icon } from "@iconify/react";
import { useHass, useHash } from "@hakit/core";
import { TimeCard, WeatherCard, Row, Column } from "@components";
import { motion, AnimatePresence } from "framer-motion";
import type { WeatherCardProps, TimeCardProps } from "@components";

const StyledTimeCard = styled(TimeCard)<{
  open: boolean;
}>`
  padding: 0;
  background: transparent;
  width: 100%;
  box-shadow: none;
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: padding;
  &:hover {
    box-shadow: none;
    background: transparent;
  }
  h4 {
    transition: var(--ha-transition-duration) var(--ha-easing);
    transition-property: font-size;
  }
  ${(props) =>
    !props.open &&
    `
    padding: 0.5rem 0;
    h4 {
      font-size: 0.7rem;
    }
  `}
`;

const StyledSidebarCard = styled(motion.div)`
  background-color: var(--ha-background-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  justify-content: flex-start;
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: min-width;
  transform-origin: left center;
  gap: 1rem;
  > * {
    transition: var(--ha-transition-duration) var(--ha-easing);
    transition-property: padding;
  }
`;

const Menu = styled(motion.ul)<{
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
        color: var(--ha-secondary-color);
      }
    }
  }
  li {
    > a {
      color: var(--ha-color);
      background-color: transparent;
      svg {
        color: var(--ha-color);
      }
    }
    &:hover,
    &.active,
    &:focus {
      > a {
        color: var(--ha-primary-active);
        background-color: var(--ha-background-opaque);

        svg {
          color: var(--ha-primary-active);
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
  border-bottom: 1px solid var(--ha-secondary-background);
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
  icon: JSX.Element | string;
  /** the hash name of the menu item, this is optional */
  hash?: string;
  /** if the item is active or not */
  active: boolean;
  /** onClick action to fire when the menu item is clicked  */
  onClick: (event: React.MouseEvent<HTMLLIElement>) => void;
}

/** This component is a nice way of organizing components / groups into an easy to navigate sidebar, the "Room Cards" will automatically insert into the sidebar items if they're present on the page, eg if you have 6 RoomCards, all 6 items will be added to the sidebar automatically, you can also add your own menu items to the start of the list, this all needs a bit more thought but for now it is pretty useful! The TimeCard and WeatherCard are integrate and themed slightly different in the sidebar, if the sidebar is present, the RoomCard will only expand to the available space and not cover the sidebar */
export interface SidebarCardProps {
  includeTimeCard?: boolean;
  startOpen?: boolean;
  weatherCardProps?: WeatherCardProps;
  autoIncludeRoutes?: boolean;
  timeCardProps?: TimeCardProps;
  menuItems?: MenuItem[];
  children?: React.ReactNode;
}
export function SidebarCard({
  weatherCardProps,
  timeCardProps = {
    includeIcon: false,
    includeDate: false,
    center: true,
  },
  startOpen = true,
  menuItems = [],
  children,
  autoIncludeRoutes = true,
  includeTimeCard = true,
}: SidebarCardProps) {
  const [open, setOpen] = useState(startOpen);
  const { routes } = useHass();
  const [hash, setHash] = useHash();
  const concatenatedMenuItems = useMemo<MenuItem[]>(() => {
    const mappedRoutes = routes.map((route) => ({
      ...route,
      title: route.name,
      onClick() {
        if (!route.active) {
          setHash("");
          setTimeout(
            () => {
              setHash(route.hash);
            },
            hash === "" ? 0 : 450,
          );
        }
      },
    }));
    return autoIncludeRoutes ? [...menuItems, ...mappedRoutes] : menuItems;
  }, [routes, autoIncludeRoutes, menuItems, setHash, hash]);
  return (
    <>
      <Global
        styles={css`
          :root {
            --ha-room-card-expanded-offset: ${open
              ? `var(--ha-device-sidebar-card-width-expanded, 19rem)`
              : `var(--ha-device-sidebar-card-width-collapsed, 5rem)`};
          }
        `}
      />
      <StyledSidebarCard
        animate={{
          minWidth: open
            ? `var(--ha-device-sidebar-card-width-expanded, 19rem)`
            : `var(--ha-device-sidebar-card-width-collapsed, 5rem)`,
          maxWidth: open
            ? `var(--ha-device-sidebar-card-width-expanded, 19rem)`
            : `var(--ha-device-sidebar-card-width-collapsed, 5rem)`,
        }}
        initial={false}
        key={`ha-sidebar-closed`}
      >
        <Column
          wrap="nowrap"
          fullHeight
          fullWidth
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Filler>
            <Row
              wrap="nowrap"
              style={{
                padding: open ? "0.28rem 0" : "0",
                flexDirection: open ? "row" : "column",
              }}
            >
              {includeTimeCard && (
                <StyledTimeCard
                  key="sidebar-large-time-card"
                  open={open}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0,
                  }}
                  {...timeCardProps}
                />
              )}
              <HamburgerMenu
                open={open}
                key="hamburger-menu-open"
                animate={{
                  width: !open ? "100%" : "40%",
                }}
              >
                <motion.li
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
                    <Icon icon={open ? "mdi:close" : "mdi:menu"} />
                  </a>
                </motion.li>
              </HamburgerMenu>
            </Row>
            <Divider />
            <Menu open={open}>
              <AnimatePresence>
                {concatenatedMenuItems.map((item, index) => {
                  return (
                    <motion.li
                      onClick={(event) => {
                        event.stopPropagation();
                        item.onClick(event);
                      }}
                      key={index}
                      className={item.active ? "active" : "inactive"}
                    >
                      <a>
                        {typeof item.icon === "string" ? (
                          <Icon icon={item.icon} />
                        ) : (
                          item.icon
                        )}
                        {open && (
                          <div className="menu-inner">
                            {item.title}
                            {item.description && (
                              <span>{item.description}</span>
                            )}
                          </div>
                        )}
                      </a>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </Menu>
            {children && open && <Filler>{children}</Filler>}
          </Filler>
          <AnimatePresence mode="wait">
            {weatherCardProps && (
              <motion.div
                key="sidebar-weather-large"
                animate={{
                  width: open ? "calc(100% - 2rem)" : "calc(100% - 0rem)",
                  padding: open ? "0 1rem 1rem" : "0",
                }}
              >
                <WeatherCardCustom
                  open={open}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{ opacity: 0 }}
                  {...weatherCardProps}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Column>
      </StyledSidebarCard>
    </>
  );
}
