import { useMediaQuery } from "@react-hookz/web";

export const useIsMobile = () =>
  useMediaQuery("only screen and (max-width : 768px)");
