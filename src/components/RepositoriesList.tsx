import React, { Component } from 'react';
import axios, { AxiosResponse } from 'axios';
import Repository from './Repository';

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  created_at: Date;
  pushed_at: Date;
  forks_count: number;
  open_issues_count: number;
  stargazers_count: number;
  watchers: number;
}

interface Props {
  language: string;
}

interface State {
  repositories: GitHubRepo[];
}

class RepositoriesList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      repositories: []
    };
  }

  public componentDidMount = () => {
    const url: string = RepositoriesList.formatUrl(this.props.language);
    axios.get(url).then((res: AxiosResponse) => {
      this.setState({ repositories: res.data.items });
    });
  }

  public render = (): JSX.Element[] | string => {
    const rep: JSX.Element[] = [];

    for (const r of this.state.repositories) {
      rep.push(<Repository key={r.id} {...r} />);
    }

    return rep.length > 0 ? rep : 'No results found...';
  }

  private static formatUrl = (language: string): string =>
    `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc`
}
export default RepositoriesList;
