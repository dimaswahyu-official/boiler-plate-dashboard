import React from "react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbProps {
  pageTitle: string;
  parentTitle?: string;
  parentPath?: string;
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

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  pageTitle,
  parentTitle,
  parentPath,
}) => {
  const location = useLocation();

  // Split the current path into segments
  const pathSegments = location.pathname.split("/").filter((segment) => segment);

  return (
    <div className="flex flex-col gap-3 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        {pageTitle}
      </h2>
      <nav aria-label="breadcrumb">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/"
            >
              Home
              <BreadcrumbArrow />
            </Link>
          </li>
          {parentTitle && parentPath && (
            <li>
              <Link
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                to={parentPath}
              >
                {parentTitle}
                <BreadcrumbArrow />
              </Link>
            </li>
          )}
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const path = `/${pathSegments.slice(0, index + 1).join("/")}`;

            return (
              <li key={path}>
                {!isLast ? (
                  <Link
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                    to={path}
                  >
                    {segment.replace(/-/g, " ")}
                    <BreadcrumbArrow />
                  </Link>
                ) : (
                  <span
                    className="text-sm text-gray-800 dark:text-white/90"
                    aria-current="page"
                  >
                    {segment.replace(/-/g, " ")}
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
