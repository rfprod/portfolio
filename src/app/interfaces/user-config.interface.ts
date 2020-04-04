export interface IUserConfigApp {
  imgRef: string;
  name: string;
  tag: string;
  urls: {
    android: string;
    repo: string;
    web: string;
  };
}

export interface IUserConfigProfile {
  imgRef: string;
  link: string;
  name: string;
}

export interface IUserConfigUsername {
  [key: string]: string;
}

export interface IUserConfig {
  apps: IUserConfigApp[];
  profiles: IUserConfigProfile[];
  username: IUserConfigUsername;
}

export interface IMailerResponse {
  [key: string]: string;
}
