import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();

  // If items are not passed explicitly, generate from location path
  const defaultItems: BreadcrumbItem[] = React.useMemo(() => {
    const rawParts = location.pathname.split('/').filter(Boolean);
    const generated: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

    let accumulatedPath = '';
    rawParts.forEach((part) => {
      accumulatedPath += `/${part}`;
      // Clean up parameter strings or path segment names
      const formattedLabel = part
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

      generated.push({
        label: formattedLabel,
        path: accumulatedPath,
      });
    });

    return generated;
  }, [location.pathname]);

  const breadcrumbsList = items || defaultItems;

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={`flex items-center text-xs font-mono text-slate-400 overflow-x-auto whitespace-nowrap py-1 ${className}`}
    >
      <ol className="flex items-center space-x-1.5">
        {breadcrumbsList.map((item, index) => {
          const isLast = index === breadcrumbsList.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-1.5 text-slate-600 font-bold">/</span>}
              {isLast || !item.path ? (
                <span className="text-[#00D9FF] font-semibold tracking-wide">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
