import { useEffect } from "react";

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const baseTitle = "InfraSight";
    document.title = title ? `${title} - ${baseTitle}` : baseTitle;

    // Reset title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
};
