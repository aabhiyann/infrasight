import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="d-flex items-center gap-sm m-none p-none list-none">
        <li>
          <a href="/" className="d-flex items-center gap-xs">
            <Home size={14} />
            <span>Dashboard</span>
          </a>
        </li>
        {items.map((item, index) => (
          <li key={index} className="d-flex items-center gap-sm">
            <ChevronRight size={14} />
            {item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
