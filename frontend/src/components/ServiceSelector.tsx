interface Props {
  services: string[];
  selectedService: string;
  onChange: (service: string) => void;
}

const ServiceSelector = ({ services, selectedService, onChange }: Props) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor="service-select" style={{ marginRight: "1rem" }}>
        Select Service:
      </label>
      <select
        id="service-select"
        value={selectedService}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All Services</option>
        {services.map((service) => (
          <option key={service} value={service}>
            {service}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ServiceSelector;
