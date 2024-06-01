interface Props {
  children: React.ReactNode;
}

export function CenterText({ children }: Props) {
  return <h1 className="mx-auto self-center">{children}</h1>;
}
