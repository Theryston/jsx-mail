export interface IMailAppConfig {
  [key: string]: {
    componentFunction: (props?: any) => JSX.Element;
    props: IMailAppProps;
  };
}

export interface IMailAppProps {
  [key: string]: string | number | boolean | IMailAppProps | IMailAppProps[];
}
