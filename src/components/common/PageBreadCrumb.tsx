import React from "react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  title: string;
  path?: string; // optional, current page doesn't need path
}

interface PageBreadcrumbProps {
  breadcrumbs: BreadcrumbItem[];
}

const BreadcrumbArrow: React.FC = () => (
  <svg
    className="stroke-current"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ breadcrumbs }) => {
  
  if (!breadcrumbs || breadcrumbs.length === 0) return null;
  const current = breadcrumbs[breadcrumbs.length - 1];

  return (
    <div className="flex flex-col gap-3 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        {current.title}
      </h2>
      <nav aria-label="breadcrumb">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
            >
              Home
              <BreadcrumbArrow />
            </Link>
          </li>

          {/* Dynamic Breadcrumbs */}
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <li key={idx}>
                {!isLast && item.path ? (
                  <Link
                    to={item.path}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                  >
                    {item.title}
                    <BreadcrumbArrow />
                  </Link>
                ) : (
                  <span
                    className="text-sm text-gray-800 dark:text-white/90"
                    aria-current="page"
                  >
                    {item.title}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
