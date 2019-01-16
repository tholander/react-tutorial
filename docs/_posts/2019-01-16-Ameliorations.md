---
layout: post
title: "Améliorations"
---

# Améliorations

On commence à être pas mal niveau contenu, par contre notre appli est vraiment moche, donc on va ajouter un peu de style.

Il y a plusieurs façons d'ajouter du style à des composants. Nous pourrions par exemple ajouter des propriétés `style` directement aux balises

```tsx
<div style={{ border: "1px solid #eee", padding: 10 }}>
  <p>Toto</p>
</div>
```

Mais ce n'est pas une bonne pratique car ça peut entraîner beaucoup de duplication. La pratique recommandée pour le moment est d'utiliser un fichier de style externe.

## CSS

On va donc créer un dossier `src/styles` qui va contenir tous les fichiers CSS de notre appli. Dans ce dossier créez un fichier `Repository.css` et remplissez comme ceci

```css
.Repository-root {
  padding: 0.5em;
  margin: 0.5em;

  border: 1px solid #eee;
  box-shadow: 2px 2px 5px #777;

  transition: linear 0.2s;
}

.Repository-root:hover {
  transform: scale(1.005);
}

.Repository-stars,
.Repository-issues,
.Repository-forks {
  color: #888;
}

.Repository-description {
  margin: 1em;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #333;
}

.Repository-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.Repository-dates {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;

  color: #888;
}
```

Et modifier le composant `Repository` pour ajouter les classes correspondantes aux balises JSX.

```tsx
import React, { Component } from "react";
import { GitHubRepo } from "./RepositoriesList";
import "../styles/Repository.css";

export default class Repository extends Component<GitHubRepo> {
  public render() {
    const r = this.props;

    return (
      <div className="Repository-root">
        <div className="Repository-header">
          <span className="Repository-name-block">
            <a className="Repository-url" href={`${r.html_url}`} target="blank">
              {r.owner.login}/<b>{r.name}</b>
            </a>
          </span>
          <span className="Repository-stars">{r.stargazers_count}</span>
          <span className="Repository-issues">{r.open_issues_count}</span>
          <span className="Repository-forks">{r.forks_count}</span>
        </div>
        <div className="Repository-description">
          <p>{r.description}</p>
        </div>
        <div className="Repository-dates">
          <span className="Repository-date-created">
            {new Date(r.created_at).toLocaleString(navigator.language)}
          </span>
          &nbsp;
          <span className="Repository-date-pushed">
            {new Date(r.pushed_at).toLocaleString(navigator.language)}
          </span>
        </div>
      </div>
    );
  }
}
```

Cela devrait ressembler à ça

![](/images/8.png)

Ça a déjà un peu plus de gueule ! On va même pouvoir rajouter quelques petits éléments !

## Ajouter des images

On va ajouter l'avatar du propriétaire du dépôt. Pour ça, modifier le bloque `Repository-name-block`

```tsx
<span className="Repository-name-block">
  <img
    className="Repository-avatar"
    src={r.owner.avatar_url}
    alt={`${r.owner.login} avatar`}
  />
  <a className="Repository-url" href={`${r.html_url}`} target="blank">
    {r.owner.login}/<b>{r.name}</b>
  </a>
</span>
```

Et ajouter les bloques suivant dans le fichier CSS

```css
.Repository-name-block {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.Repository-avatar {
  width: 2em;
  margin: 0.5em;
}
```

Et maintenant on va rajouter quelques icônes. Heureusement pour nous, GitHub nous laisse à disposition tous ses icônes, et il y a même une librairie pour les utiliser comme composants React !

Prenez votre plus beau terminal, et installez la librairie

```bash
npm install --save @githubprimer/octicons-react
```

puis retournez dans le composant `Repository`, et ajoutez l'import

```tsx
import Octicon, {
  Star,
  RepoForked,
  IssueOpened,
  Calendar,
  RepoPush
} from "@githubprimer/octicons-react";
```

Et modifiez le JSX de la méthode `render` pour qu'il ressemble à ceci

```tsx
<div className="Repository-root">
  <div className="Repository-header">
    <span className="Repository-name-block">
      <img
        className="Repository-avatar"
        src={r.owner.avatar_url}
        alt={`${r.owner.login} avatar`}
      />
      <a className="Repository-url" href={`${r.html_url}`} target="blank">
        {r.owner.login}/<b>{r.name}</b>
      </a>
    </span>
    <span className="Repository-stars">
      <Octicon icon={Star} />
      &nbsp;
      {r.stargazers_count}
    </span>
    <span className="Repository-issues">
      <Octicon icon={IssueOpened} />
      &nbsp;{r.open_issues_count}
    </span>
    <span className="Repository-forks">
      <Octicon icon={RepoForked} />
      &nbsp;{r.forks_count}
    </span>
  </div>
  <div className="Repository-description">
    <p>{r.description}</p>
  </div>
  <div className="Repository-dates">
    <span className="Repository-date-created">
      <Octicon icon={Calendar} />
      &nbsp;
      {new Date(r.created_at).toLocaleString(navigator.language)}
    </span>
    &nbsp;
    <span className="Repository-date-pushed">
      <Octicon icon={RepoPush} />
      &nbsp;
      {new Date(r.pushed_at).toLocaleString(navigator.language)}
    </span>
  </div>
</div>
```

Le résultat a franchement de la gueule !

![](/images/10.png)

Maintenant que le composant `Repository` est suffisamment beau, on va bientôt pouvoir le laisser tranquille. Mais avant, on va simplifier un tout petit peu le composant. Vous avez peut être remarqué que le composant ne redéfini aucune méthode du cycle de vie, et n'utilise pas le `state`. C'est ce qu'on appelle un **composant stateless**. Et il y a une manière plus simple de déclarer un composant stateless. On peut le déclarer comme une fonction prenant des props et retournant des éléments JSX. Modifions donc le code pour le déclarer comme cela.

```tsx
import React, { Component, PureComponent } from "react";
import { GitHubRepo } from "./RepositoriesList";
import Octicon, {
  Star,
  RepoForked,
  IssueOpened,
  Calendar,
  RepoPush
} from "@githubprimer/octicons-react";
import "../styles/Repository.css";

export default (props: GitHubRepo): JSX.Element => (
  <div className="Repository-root">
    <div className="Repository-header">
      <span className="Repository-name-block">
        <img
          className="Repository-avatar"
          src={props.owner.avatar_url}
          alt={`${props.owner.login} avatar`}
        />
        <a className="Repository-url" href={`${props.html_url}`} target="blank">
          {props.owner.login}/<b>{props.name}</b>
        </a>
      </span>
      <span className="Repository-stars">
        <Octicon icon={Star} />
        &nbsp;
        {props.stargazers_count}
      </span>
      <span className="Repository-issues">
        <Octicon icon={IssueOpened} />
        &nbsp;{props.open_issues_count}
      </span>
      <span className="Repository-forks">
        <Octicon icon={RepoForked} />
        &nbsp;{props.forks_count}
      </span>
    </div>
    <div className="Repository-description">
      <p>{props.description}</p>
    </div>
    <div className="Repository-dates">
      <span className="Repository-date-created">
        <Octicon icon={Calendar} />
        &nbsp;
        {new Date(props.created_at).toLocaleString(navigator.language)}
      </span>
      &nbsp;
      <span className="Repository-date-pushed">
        <Octicon icon={RepoPush} />
        &nbsp;
        {new Date(props.pushed_at).toLocaleString(navigator.language)}
      </span>
    </div>
  </div>
);
```

Et voilà ! On a un composant stateless !

> Mais c'est quoi cette fonction ??

Vous avez peut être vu que j'ai déclaré ma fonction de manière bizarre. C'est une syntaxe qui a été introduite dans la version 2015 de JavaScript, et qui permet d'alléger la syntaxe des fonctions. Cela permet de remplacer

```typescript
function(foo: Foo): Bar {
    return foo.bar;
}
```

par

```typescript
(foo: Foo): Bar => {
  return foo.bar;
};
```

Ou même, si la fonction ne fait que retourner une valeur, on peut écrire

```typescript
(foo: Foo): Bar => foo.bar;
```

Cela fait partie d'une des nombreuses améliorations apportés par la version ES6 de JavaScript. Et d'ailleurs, on va profiter de cette introduction à ES6 pour reformater notre code pour qu'il soit un peu plus moderne !
