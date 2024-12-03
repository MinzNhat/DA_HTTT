import { useState, useRef, useEffect } from 'react';
import { useHandleClickOutsideAlerter } from '@/utils/handleClickOutside';
import ReactDOM from 'react-dom';

type DropdownPosition = 'top' | 'bottom' | 'left' | 'right';

type DropdownProps = {
  position?: string;
  className?: string;
  animation?: string;
  disabled?: boolean;
  maxWidth?: boolean;
  openWrapper?: boolean;
  button?: React.ReactNode;
  children?: React.ReactNode;
  dropdownPosition?: DropdownPosition;
  setOpenWrapper?: React.Dispatch<React.SetStateAction<boolean>>;
};

type DropdownPositionState = {
  top: number | undefined;
  left: number | undefined;
}

const debounce = <T extends (..._args: unknown[]) => void>(func: T, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Dropdown = ({
  button, children, className, animation, position, maxWidth, dropdownPosition = 'bottom',
  disabled = false, openWrapper: parentOpenWrapper, setOpenWrapper: parentSetOpenWrapper,
}: DropdownProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [localOpenWrapper, setLocalOpenWrapper] = useState<boolean>(false);
  const [dropdownPositionState, setDropdownPositionState] = useState<DropdownPositionState>({ top: undefined, left: undefined });
  const [isBrowser, setIsBrowser] = useState<boolean>(false);

  const dropdownPositionClasses = {
    top: `${position ? position : 'origin-bottom'}`,
    bottom: `${position ? position : 'origin-top'}`,
    left: `${position ? position : 'origin-top-right'}`,
    right: `${position ? position : 'origin-top-left'}`,
  }[dropdownPosition];

  const openWrapper = parentOpenWrapper !== undefined ? parentOpenWrapper : localOpenWrapper;
  const setOpenWrapper = parentSetOpenWrapper ?? setLocalOpenWrapper;

  const handleOnMouseDown = () => {
    if (!disabled) {
      setOpenWrapper(!openWrapper);
    }
  };

  useHandleClickOutsideAlerter({ ref: [wrapperRef, dropdownRef], setState: setOpenWrapper });

  const setDropdownPosition = () => {
    if (buttonRef.current) {
      const button = buttonRef.current as HTMLElement;
      const buttonRect = button.getBoundingClientRect();
      let top: number | undefined = 0;
      let left: number | undefined = 0;

      switch (dropdownPosition) {
        case 'top':
          top = dropdownRef.current ? buttonRect.top - dropdownRef.current.clientHeight - 8 : undefined;
          left = buttonRect.left;
          break;
        case 'bottom':
          top = buttonRect.bottom + 8;
          left = buttonRect.left;
          break;
        case 'left':
          top = buttonRect.top;
          left = wrapperRef.current ? buttonRect.left - wrapperRef.current?.clientWidth - 8 : undefined;
          break;
        case 'right':
          top = buttonRect.top;
          left = buttonRect.right + 8;
          break;
        default:
          top = buttonRect.bottom;
          left = buttonRect.left;
          break;
      }
      setDropdownPositionState({ top, left });
    }
  };

  const debouncedSetDropdownPosition = debounce(setDropdownPosition, 100);

  useEffect(() => {
    setIsBrowser(true);

    debouncedSetDropdownPosition();

    const handleResize = () => {
      debouncedSetDropdownPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dropdownPosition, debouncedSetDropdownPosition]);

  useEffect(() => {
    debouncedSetDropdownPosition();
  }, [buttonRef, debouncedSetDropdownPosition]);

  return (
    <div ref={wrapperRef} className={`relative flex ${maxWidth ? 'w-full' : ''}`}>
      <div ref={buttonRef} className={`flex ${maxWidth ? 'w-full' : ''}`} onMouseDown={handleOnMouseDown}>
        {button}
      </div>

      {isBrowser && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          className={`z-[1000] ${className} ${dropdownPositionClasses}
                      ${animation ? animation : 'transition-all duration-300 ease-in-out'}
                      ${openWrapper && dropdownPositionState.top && dropdownPositionState.left ? 'scale-100' : 'scale-0'}`}
          style={{
            width: buttonRef.current?.getBoundingClientRect().width,
            position: 'fixed',
            top: dropdownPositionState.top,
            left: dropdownPositionState.left,
            zIndex: 45,
          }}
        >
          <div className='relative w-full'>
            {children}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Dropdown;