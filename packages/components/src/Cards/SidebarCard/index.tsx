import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { Icon } from "@iconify/react";
import { useHass, useHash } from "@hakit/core";
import { TimeCard, WeatherCard, Row, Column } from "@components";
import { motion, AnimatePresence } from "framer-motion";
import type { WeatherCardProps, TimeCardProps } from "@components";

const StyledTimeCard = styled(TimeCard)`
  background: transparent;
  width: 100%;
  box-shadow: none;
  &:hover {
    box-shadow: none;
    background: transparent;
  }
`;

const SmallTimeCard = styled(StyledTimeCard)`
  padding: 0.5rem 0;
  h4 {
    font-size: 0.7rem;
  }
`

const StyledSidebarCard = styled(motion.div)<{
  open: boolean;
}>`
  
  ${props => props.open ? `width: var(--ha-device-sidebar-card-width-expanded)` : `width: var(--ha-device-sidebar-card-width-collapsed)`};
  background-color: var(--ha-background-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: width, padding;
  padding: ${props => props.open ? `1rem` : `0rem`};
  gap: 1rem;
`;

const Menu = styled.ul`
  margin: 0;
  padding: 0;
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
      height: 48px;
      text-decoration: none;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 1rem;
      padding: 0;
      padding-left: 16px;
      padding-right: 56px;

      &:hover {        
        background: transparent;
      }
      svg {
        display: inline-block;
        margin-right: 16px;
        min-width: 40px;
        width: 40px;
        text-align: left;
        font-size: 20px;
      }
    }
  }
  li > a {
    color: var(--ha-color);
    background-color: transparent;

    svg {
      color: var(--ha-color);
    }
  }
  li:hover > a, li > a:hover {
    color: var(--ha-primary-active);
    background-color: var(--ha-background-opaque);

    svg {
      color: var(--ha-primary-active);
    }
  }
  li:focus > a, li > a:focus {
    color: var(--ha-primary-active);
    background-color: var(--ha-background-opaque);

    svg {
      color: var(--ha-primary-active);
    }
  }

`

const MenuCollapsed = styled(Menu)`
  li {
    a {
      padding: 0;
      justify-content: center;
      svg {
        margin: 0;
      }
    }
  }
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--ha-secondary-background);
  margin: 0;
`;

const HamburgerMenu = styled(Menu)`
  width: auto;
  li {
    a {
      justify-content: center;
      padding: 1rem;
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

const SmallWeatherCard = styled(StyledWeatherCard)`
  padding-bottom: 1rem;
  border-radius: 0;
  div > * {
    display: none;
  }
  div > svg {
    display: flex;
  }
`;
export interface MenuItem {
  name: string;
  icon: string;
  hash?: string;
  onClick: () => void;
}

export interface SidebarCardProps {
  includeTimeCard?: boolean;
  includeWeatherCard?: boolean;
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
  includeWeatherCard = true,
}: SidebarCardProps) {
  const [open, setOpen] = useState(startOpen);
  const { routes } = useHass();
  const [hash, setHash] = useHash();
  const concatenatedMenuItems = useMemo<MenuItem[]>(() => {
    const mappedRoutes = routes.map(route => ({
      ...route,
      onClick() {
        setHash(route.hash);
      }
    }));
    return autoIncludeRoutes ? [...menuItems, ...mappedRoutes] : menuItems;
  }, [routes, autoIncludeRoutes, menuItems, setHash]);
  console.log("routes", hash, routes);
  return <>
    <AnimatePresence>
    {open && <StyledSidebarCard open={true} layoutId="ha-sidebar">
      <Column wrap="nowrap" fullHeight fullWidth alignItems="flex-start" justifyContent="space-between">
        <Filler>
          <Row wrap="nowrap">
            {includeTimeCard && <StyledTimeCard layoutId="ha-sidebar-time" {...timeCardProps} />}
            <HamburgerMenu>
              <motion.li
                  layoutId="ha-sidebar-menu"
                  onClick={() => {
                    setOpen(!open)
                  }}
                >
                  <a 
                  style={{
                    justifyContent: 'center',
                  }}>
                    <Icon icon="mdi:menu" />
                  </a>
              </motion.li>
            </HamburgerMenu>
          </Row>
          <Divider />
          <Menu>
          {concatenatedMenuItems.map((item, index) => {
            return (
              <li
                onClick={item.onClick}
                key={index}
              >
                <a>
                  <Icon icon={item.icon} />
                  {item.name}
                </a>
              </li>
            );
          })}
          </Menu>
          {children && <Column wrap="nowrap" gap="0.5rem">
            {children}
          </Column>}
        </Filler>
        {includeWeatherCard && weatherCardProps && (
          <StyledWeatherCard layoutId="ha-sidebar-weather" {...weatherCardProps} />
        )}
      </Column>
    </StyledSidebarCard>}
    {!open && <StyledSidebarCard open={false} layoutId="ha-sidebar">
    <Column wrap="nowrap" fullHeight fullWidth alignItems="flex-start" justifyContent="space-between">
      <Filler>
      {includeTimeCard && <SmallTimeCard layoutId="ha-sidebar-time" {...timeCardProps} />}
      <MenuCollapsed>
        <motion.li
            layoutId="ha-sidebar-menu"
            onClick={() => {
              setOpen(!open)
            }}
          >
            <a>
              <Icon icon="mdi:menu" />
            </a>
        </motion.li>
      {concatenatedMenuItems.map((item, index) => {
        return (
          <li
            onClick={item.onClick}
            key={index}
          >
            <a>
              <Icon icon={item.icon} />
            </a>
          </li>
        );
      })}
      </MenuCollapsed>
      </Filler>
      {includeWeatherCard && weatherCardProps && (
          <SmallWeatherCard layoutId="ha-sidebar-weather" {...weatherCardProps} />
      )}
      </Column>
    </StyledSidebarCard>}
    </AnimatePresence>
  </>
}
