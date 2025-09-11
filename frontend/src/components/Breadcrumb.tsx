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
      <ol
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        <li>
          <a
            href="/"
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            <Home size={14} />
            <span>Dashboard</span>
          </a>
        </li>
        {items.map((item, index) => (
          <li
            key={index}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
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
