# dataone-solr-refactor-demo

This is a simple demo of a pretty major change to the DataONE search index. Instead of the Solr documents in a Data Package having a resourceMap field linking the package member to its package:

```json
[
  {
    "id": "M1",
    "type": "metadata",
    "name": "My cool dataset"
  },
  {
    "id": "P1",
    "type": "package",
    "members": ["M1"]
  }
]
```

we use a Solr join to query for the package members directly:

```
?q={!join from=members to=id}id:{package_id}
```

## Running

### Pre-requisites

- Node & Yarn (npm will work)
- Solr running on `:8983`

### Install application dependencies

```
yarn install
```

### Set up Solr

```
solr create -c objects
solr create -c relationships
```

### Build the Solr index

```
yarn build-index
```

### Start the server

```
yarn dev
```

Visit http://localhost:3000
