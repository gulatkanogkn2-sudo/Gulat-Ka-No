import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, ChevronDown } from 'lucide-react';

export interface ActionMenuItem {
  id?: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  variant?: 'default' | 'danger' | 'warning' | 'info' | 'cyan' | 'purple' | 'emerald';
  className?: string;
  disabled?: boolean;
  divider?: boolean;
}

export interface ActionMenuProps {
  items?: ActionMenuItem[];
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  triggerClassName?: string;
  label?: string;
  icon?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'right' | 'left';
  menuWidth?: string | number;
  menuClassName?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  children,
  trigger,
  triggerClassName,
  label = 'ACTIONS',
  icon,
  isOpen: controlledIsOpen,
  onOpenChange,
  align = 'right',
  menuWidth,
  menuClassName,
  disabled = false,
  ariaLabel,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    maxHeight?: number;
  }>({});

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setInternalIsOpen(open);
      }
      if (onOpenChange) {
        onOpenChange(open);
      }
    },
    [isControlled, onOpenChange]
  );

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Check if trigger is off-screen (scrolled past viewport)
    if (rect.bottom < -50 || rect.top > windowHeight + 50 || rect.right < -50 || rect.left > windowWidth + 50) {
      setIsOpen(false);
      return;
    }

    const estimatedHeight = menuRef.current?.offsetHeight || (items ? items.length * 40 + 16 : 200);
    const estimatedWidth = menuRef.current?.offsetWidth || (typeof menuWidth === 'number' ? menuWidth : 200);

    const spaceBelow = windowHeight - rect.bottom;
    const spaceAbove = rect.top;

    const openUpward = spaceBelow < estimatedHeight + 12 && spaceAbove > spaceBelow;

    let computedTop: number | undefined;
    let computedBottom: number | undefined;
    let computedLeft: number | undefined;
    let computedRight: number | undefined;
    let computedMaxHeight: number | undefined;

    if (openUpward) {
      computedBottom = windowHeight - rect.top + 6;
      computedMaxHeight = Math.min(spaceAbove - 16, 380);
    } else {
      computedTop = rect.bottom + 6;
      computedMaxHeight = Math.min(spaceBelow - 16, 380);
    }

    if (align === 'right') {
      const idealRight = windowWidth - rect.right;
      if (windowWidth - idealRight - estimatedWidth < 8) {
        computedLeft = Math.max(8, windowWidth - estimatedWidth - 8);
      } else {
        computedRight = Math.max(8, idealRight);
      }
    } else {
      const idealLeft = rect.left;
      if (idealLeft + estimatedWidth > windowWidth - 8) {
        computedRight = Math.max(8, windowWidth - idealLeft);
      } else {
        computedLeft = Math.max(8, idealLeft);
      }
    }

    setCoords({
      top: computedTop,
      bottom: computedBottom,
      left: computedLeft,
      right: computedRight,
      maxHeight: computedMaxHeight,
    });
  }, [align, items, menuWidth, setIsOpen]);

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, updatePosition, setIsOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const getItemVariantClass = (variant?: ActionMenuItem['variant']) => {
    switch (variant) {
      case 'danger':
        return 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300';
      case 'warning':
        return 'text-amber-400 hover:bg-amber-500/10 hover:text-amber-300';
      case 'cyan':
        return 'text-[#00D9FF] hover:bg-[#00D9FF]/10 hover:text-white';
      case 'purple':
        return 'text-purple-400 hover:bg-purple-500/10 hover:text-purple-300';
      case 'emerald':
        return 'text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300';
      default:
        return 'text-slate-200 hover:bg-slate-800/80 hover:text-[#00D9FF]';
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-label={ariaLabel || (typeof label === 'string' ? label : 'Actions menu')}
        className={
          triggerClassName ||
          `px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all flex items-center gap-1.5 ml-auto cursor-pointer shadow-sm ${
            isOpen
              ? 'bg-[#00D9FF] text-black border-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.4)]'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
          }`
        }
      >
        {trigger ? (
          trigger
        ) : (
          <>
            {icon || <MoreVertical className="w-3.5 h-3.5 shrink-0" />}
            {label && <span>{label}</span>}
            <ChevronDown
              className={`w-3 h-3 opacity-70 shrink-0 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </>
        )}
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] pointer-events-auto">
            {/* Backdrop click listener */}
            <div
              className="fixed inset-0 bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />

            {/* Menu Container */}
            <div
              ref={menuRef}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'fixed',
                top: coords.top !== undefined ? `${coords.top}px` : undefined,
                bottom: coords.bottom !== undefined ? `${coords.bottom}px` : undefined,
                left: coords.left !== undefined ? `${coords.left}px` : undefined,
                right: coords.right !== undefined ? `${coords.right}px` : undefined,
                maxHeight: coords.maxHeight !== undefined ? `${coords.maxHeight}px` : '380px',
                width:
                  typeof menuWidth === 'number'
                    ? `${menuWidth}px`
                    : menuWidth || undefined,
              }}
              className={
                menuClassName ||
                `w-48 bg-[#090D16] border border-slate-800 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(0,217,255,0.15)] py-1.5 font-mono text-xs overflow-y-auto text-left animate-in fade-in zoom-in-95 duration-100 divide-y divide-slate-800/60`
              }
            >
              {items && items.length > 0 ? (
                <div className="py-0.5">
                  {items.map((item, idx) => (
                    <React.Fragment key={item.id || idx}>
                      {item.divider && idx > 0 && <div className="my-1 border-t border-slate-800/80" />}
                      <button
                        type="button"
                        disabled={item.disabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.disabled) return;
                          setIsOpen(false);
                          item.onClick(e);
                        }}
                        className={`w-full px-3.5 py-2 text-left flex items-center gap-2.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          item.className || getItemVariantClass(item.variant)
                        }`}
                      >
                        {item.icon && <span className="shrink-0">{item.icon}</span>}
                        <span className="truncate">{item.label}</span>
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                children
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
