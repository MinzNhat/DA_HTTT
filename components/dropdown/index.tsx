'use client'
import { useEffect, useState, useRef, ReactNode, FC } from 'react'

function useOutsideAlerter(ref: any, setX: any) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setX(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setX]);
}

type Props = {
  button?: ReactNode
  children?: ReactNode
  className?: string
  animation?: string | any
}

const Dropdown: FC<Props> = ({ button, children, className, animation }) => {
  const wrapperRef = useRef(null);
  const [openWrapper, setOpenWrapper] = useState(false);
  useOutsideAlerter(wrapperRef, setOpenWrapper);

  return (
    <div ref={wrapperRef} className="relative flex">
      <div className="flex" onMouseDown={() => setOpenWrapper(!openWrapper)}>
        {button}
      </div>
      <div
        className={`${className} absolute z-10 ${animation
          ? animation
          : "origin-top-right transition-all duration-300 ease-in-out"
          } ${openWrapper ? "scale-100" : "scale-0"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
