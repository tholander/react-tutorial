import React, { Component, PureComponent } from 'react';
import { GitHubRepo } from './RepositoriesList';
import Octicon, {
  Star,
  RepoForked,
  IssueOpened,
  Calendar,
  RepoPush
} from '@githubprimer/octicons-react';
import '../styles/Repository.css';

export default (props: GitHubRepo): JSX.Element => (
  <div className='Repository-root'>
    <div className='Repository-header'>
      <span className='Repository-name-block'>
        <img
          className='Repository-avatar'
          src={props.owner.avatar_url}
          alt={`${props.owner.login} avatar`}
        />
        <a className='Repository-url' href={`${props.html_url}`} target='blank'>
          {props.owner.login}/<b>{props.name}</b>
        </a>
      </span>
      <span className='Repository-stars'>
        <Octicon icon={Star} />
        &nbsp;
        {props.stargazers_count}
      </span>
      <span className='Repository-issues'>
        <Octicon icon={IssueOpened} />
        &nbsp;{props.open_issues_count}
      </span>
      <span className='Repository-forks'>
        <Octicon icon={RepoForked} />
        &nbsp;{props.forks_count}
      </span>
    </div>
    <div className='Repository-description'>
      <p>{props.description}</p>
    </div>
    <div className='Repository-dates'>
      <span className='Repository-date-created'>
        <Octicon icon={Calendar} />
        &nbsp;
        {new Date(props.created_at).toLocaleString(navigator.language)}
      </span>
      &nbsp;
      <span className='Repository-date-pushed'>
        <Octicon icon={RepoPush} />
        &nbsp;
        {new Date(props.pushed_at).toLocaleString(navigator.language)}
      </span>
    </div>
  </div>
);
