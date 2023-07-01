import React, { CSSProperties, memo, useCallback, useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled';

export interface RipplesProps {
  during?: number
  color?: string
  onClick?: (ev: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  children?: React.ReactNode;
  borderRadius?: CSSProperties['borderRadius'];
}

const boxStyle: CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  overflow: 'hidden',
}

const StyledRipple = styled.div`
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  width: 35px;
  height: 35px;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const ParentRipple = styled.div<{
  borderRadius: RipplesProps['borderRadius'];
}>`
  ${props => props.borderRadius && `
    border-radius: ${props.borderRadius};
    overflow: hidden;
    display: inline-flex;
  `}
`;

export const Ripples = memo((props: Partial<RipplesProps> = {} ) => {
  const [rippleStyle, setRippleStyle] = useState<CSSProperties>({});
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const options = {
    duration: 600,
    color: 'rgba(0, 0, 0, .3)',
    className: '',
    borderRadius: 'none',
    ...props
  }

  const {
    children,
    duration,
    color,
    onClick,
    className,
    borderRadius,
    ...rest
  } = options

  useEffect(() => {
    return () => {
      // cleanup
      if (timeoutId.current) clearTimeout(timeoutId.current);
    }
  }, [])

  const onClickHandler = useCallback((event: React.MouseEvent<HTMLDivElement>) => {

    event.stopPropagation();
    // clear the timeout if exists
    if (timeoutId.current !== null) clearTimeout(timeoutId.current);

    const { pageX, pageY, currentTarget } = event;

    const rect = currentTarget.getBoundingClientRect();

    const left = pageX - (rect.left + window.scrollX);
    const top = pageY - (rect.top + window.scrollY);
    const size = Math.max(rect.width, rect.height);

    setRippleStyle(state => ({
      ...state,
      left,
      top,
      opacity: 1,
      transform: 'translate(-50%, -50%)',
      transition: 'initial',
      backgroundColor: color,
    }));
    // start a timeout to scale the ripple
    timeoutId.current = setTimeout(() => {
      setRippleStyle(state => ({
        ...state,
        opacity: 0,
        transform: `scale(${size / 9})`,
        transition: `all ${duration}ms`,
      }));
      timeoutId.current = null;
    }, 50);

    if (typeof onClick === 'function') onClick(event);
  }, [color, duration, onClick]);



  return <ParentRipple borderRadius={borderRadius}>
      <div
        {...rest}
        className={`${className}`.trim()}
        style={boxStyle}
        onClick={onClickHandler}
      >
        {children}
        <StyledRipple style={{
          ...rippleStyle,
        }} />
      </div>
    </ParentRipple>;
});