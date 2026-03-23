interface Props {
  title: string;
  subTitle: string;
}

export default function AuthImagePattern({ title, subTitle }: Props) {
  return (
    <div>
      {title} {subTitle}
    </div>
  );
}
