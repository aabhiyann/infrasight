interface ServiceSelectorProps {
  services: string[];
  selectedService: string;
  onChange: (service: string) => void;
}

const ServiceSelector = ({
  services,
  selectedService,
  onChange,
}: ServiceSelectorProps) => {
  return (
    <div className="toolbar">
      <label htmlFor="service-select">Select Service:</label>
      <select
        className="select"
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
