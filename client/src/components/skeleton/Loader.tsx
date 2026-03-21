import cn from "../../utils/cn";

interface Props {
  className?: string;
}

export default function Loader({ className }: Props) {
  return <div className={cn(className, "")}>Loader</div>;
}
