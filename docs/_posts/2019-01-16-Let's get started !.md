---
layout: post
title: "Let's get started"
---

# Let's get started !

Pour l'instant, on va essayer de construire une page qui nous permettra de visualiser la liste des dépôts populaires sur GitHub. Pour ça, GitHub possède une API REST publique, qui va nous permettre de faire un peu joujou.

Mais comme une API REST n'est utilisable que via des requêtes HTTP, il va falloir que l'on fasse des requêtes depuis nos composants React pour utiliser les données gentillement mises à dispositions par l'API. Mais commençons déjà par mettre en place ce qui est nécessaire.

## Premier composant

Pour garder notre projet structuré, commencez par créer le dossier `src/components` et créez un fichier `RepositoriesList.tsx` dans ce répertoire. Enfin, insérez le contenu suivant dans le fichier.

```tsx
import React, { Component } from "react";

class RepositoriesList extends Component {
  public render() {
    return "";
  }
}
export default RepositoriesList;
```

On va expliquer ce contenu ligne par ligne.

- ```tsx
  import React from "react";
  ```

  Cette ligne sert à importer l'export principal du fichier `react` et de mettre tout ce contenu dans une variable global qui s'appelle `React`. Cette ligne est obligatoire dans n'importe quel fichier où l'on veut déclarer un nouveau composant.

- ```tsx
  class RepositoriesList extends React.Component
  ```

  Cette ligne sert à déclarer une nouvelle classe TypeScript qui étend la classe `Component` de React. On vient donc de créer un nouveau composant React. Mais ce n'est pas la seule manière de faire, on en verra une autre plus tard.

- ```tsx
  public render() {
      return "";
  }
  ```

  Ici, on ajoute la méthode publique `render` au composant. Cette méthode est obligatoire pour chaque composant React, parce que c'est elle qui décrit de quelle manière notre composant va être affiché dans le navigateur. La méthode peut retourner une chaîne de caractères, un tableau, ou du contenu JSX (comme dans le composant `App.tsx`)

- ```tsx
  export default RepositoriesList;
  ```

  Le mot clé `export` nous permet de définir ce que l'on veut exporter de ce fichier. C'est-à-dire quelle parties veut on rendre accessible depuis l’extérieur du fichier. Le mot clé `default` quant à lui, indique que c'est l'export principal de notre fichier. Pour expliquer ça, on va prendre un petit exemple.

## Explication des imports/exports

```tsx
  import React, { Component } from 'react';

  const hello = "Hello World!";

  class HelloWorld extends Component {
      public render() {
          return hello;
      }
  }
  export default HelloWorld;
  export hello;
```

Dans ce cas là, si l'on veut récupérer le composant `HelloWorld` depuis un autre fichier, on peut le faire grâce à la ligne

```tsx
import HelloWorld from "./HelloWorld";
```

En revanche si l'on veut récupérer simplement la variable `hello`, on le faire de la manière suivante

```tsx
import { hello } from "./HelloWorld";
```

Pour résumer, l'export principal d'un fichier (parce qu'il ne peut y avoir qu'un export principal par fichier), peut être récupéré en écrivant le nom de la variable dans laquelle on voudra le contenir. Exemple :

```tsx
import HelloWorldComponentDontJaiChangéLeNomParceQueCestPlusJoli from "./HelloWorld";
```

Et les autres exports doivent être récupérés en inscrivant leur vrai nom, entre les symboles `{}`.

## On va peut être commencer à coder non ?

Revenons en à notre composant `RepositoriesList`. On va créer une interface pour décrire les objets que l'on va récupérer de l'API de GitHub. Ajouter le contenu suivant :

```tsx
import React, { Component } from "react";

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

  public render() {
    return "";
  }

  private static formatUrl(language: string): string {
    return `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc`;
  }
}
export default RepositoriesList;
```

Ensuite, replacer la méthode `render` par

```tsx
public render() : JSX.Element[] | string {
    const rep: JSX.Element[] = [];

    for (const r of this.state.repositories) {
      rep.push(<div key={r.id}>{r.name}</div>);
    }

    return rep;
}
```

Sauvegardez le fichiers, puis retourner dans le fichier `src/App.tsx` et remplacez le contenu par

```tsx
import React, { Component } from "react";
import RepositoriesList from "./components/RepositoriesList";

class App extends Component {
  public render(): JSX.Element {
    return <RepositoriesList language="javascript" />;
  }
}

export default App;
```

Après avoir sauvegardez, retournez voir dans votre navigateur, et vous devriez voir afficher... rien.

![](/images/3.png)

C'est parce que la variable `rep`, qui se trouve dans la méthode `render` du composant `RepositoriesList` est un tableau vide. On va donc ajouter une petite condition pour voir ça. Remplaçons le retour de la méthode `render` par

```tsx
return rep.length > 0 ? rep : "No results found...";
```

Rechargez la page, et vous devriez voir

![](/images/4.png)

Maintenant que l'affichage se comporte correctement quand notre liste est vide, il serait peut être temps de la remplir !

## Récupérer des données d'une API REST

Il existe des fonctions natives à JavaScript pour faire des requêtes HTTP, mais elles sont un peu primaires, on va donc se permettre d'utiliser une librairie qui fera ça mieux que nous. La librairie en question s'appelle [Axios](https://github.com/axios/axios). C'est une des librairies les plus connus car elle est extrêmement simple à utiliser. Pour l'installer dans notre projet, il va falloir utiliser NPM à nouveau. Pour ça, lancez les commandes

```bash
$ npm install --save axios
```

Cela va copier tous les fichiers nécessaires à l'utilisation de la librairie, dans le dossier `node_modules` de notre projet. Ça veut donc dire qu'on va enfin pouvoir récupérer des données!

On va maintenant importer axios dans notre composant. Pour ça, ajouter la ligne

```tsx
import axios, { AxiosResponse } from "axios";
```

en haut du fichier `RepositoriesList.tsx`. Ensuite on va ajouter la méthode `componentDidMount` à notre composant.

```tsx
public componentDidMount() {
    const url: string = RepositoriesList.formatUrl(this.props.language);
    axios.get(url).then(function(res: AxiosResponse) {
      this.setState({ repositories: res.data.items });
    });
  }
```

Si vous sauvegardez et rechargez la page, vous devriez avoir la chose suivante

![](/images/5.png)

On va faire une petite pause dans le code pour comprendre tout ce qu'il se passe.

## Cycle de vie, State et Props

On vient juste d'implémenter la méthode `componentDidMount` de notre composant. Cette méthode est une méthode du cycle de vie d'un composant, que l'on hérite de la classe `Component` de React.

![](/images/6.png)

Le cycle de vie des composants est composé de plusieurs phases, et donc de plusieurs méthodes que l'on peut redéfinir, mais pour cette formation on va se contenter des méthodes ci-dessus.

Comme le montre le schéma, l'appel à la méthode `componentDidMount` se fait juste après le premier appel à la méthode `render`, c'est donc l'endroit parfait pour effectuer des actions asynchrones qui servent au rendu du composant. Vous avez peut être aussi remarquez qu'à la troisième ligne de la méthode `componentDidMount` j'ai appelé la méthode `setState` du composant. Naturellement, nous aurions pu écrire

```tsx
this.state.repositories = res.data.items;
```

et cela aurait fonctionné, mais cette méthode est déconseillé car l'appel à la méthode `setState` permet non seulement de changer le _state_ du composant, mais aussi de déclencher un nouveau rendu du composant, ce qui n'est pas le cas de la méthode ci-dessus.

## C'est un peu vide quand même

Pour l'instant on a juste afficher le nom des répositories de Github, on va rajouter un peu de contenu. Pour ça, on va créer un nouveau composant. Créez un nouveau fichier `src/components/Repository.tsx`, et remplissez le comme suit

```tsx
import React, { Component } from "react";
import { GitHubRepo } from "./RepositoriesList";

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

Puis modifiez la composant `RepositoriesList` pour qu'il ressemble à

```tsx
import React, { Component } from 'react';
import Repository from './Repository';

...

public render() : JSX.Element[] | string {
    const rep: JSX.Element[] = [];

    for (const r of this.state.repositories) {
      rep.push(<Repository key={r.id} {...r}/>);
    }

    return rep.length > 0 ? rep : 'No results found...';
}
```

Vous devriez obtenir quelque chose comme ça

![](/images/7.png)

Voilà y a déjà plus de contenu ! Mais bon, c'est vachement moche...
