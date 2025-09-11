import { useEffect, useState } from "react";
import { fetchServices } from "../api/serviceApi.ts";

interface Props {
  selected: string;
  onChange: (value: string) => void;
  includeAllOption?: boolean;
}

const ServiceFilterDropdown = ({
  selected,
  onChange,
  includeAllOption = true,
}: Props) => {
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const data = await fetchServices();
      setServices(data);
    }
    load();
  }, []);

  return (
    <select
      className="select"
      value={selected}
      onChange={(e) => onChange(e.target.value)}
    >
      {includeAllOption && <option value="">All Services</option>}
      {services.map((service) => (
        <option key={service} value={service}>
          {service}
        </option>
      ))}
    </select>
  );
};

export default ServiceFilterDropdown;
