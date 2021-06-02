# dataone-solr-refactor-demo

How would building a client-side application for DataONE work if the Solr index was much simpler:

- One core for Objects
- One core for Data Packaging relationships

## Running

### Pre-requisites

- Node & npm
- Solr running on `:8983`

### Install application dependencies

```
npm install
```

### Set up Solr

```
solr create -c objects
solr create -c packages
```

### Build the Solr index

```
npm run build-index
```

### Start the server

```
npm run dev
```

Visit http://localhost:3000
