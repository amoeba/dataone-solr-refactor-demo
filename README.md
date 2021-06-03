# dataone-solr-refactor-demo

This is a simple demo of a pretty major change to the DataONE search index.
Instead of the Solr documents in a Data Package having a `resourceMap` field linking the package member to its package:

```json
[
  {
    "id": "M1",
    "type": "metadata",
    "name": "My cool dataset",
    "resourceMap": [
      "P1"
    ]
  },
  {
    "id": "P1",
    "type": "package",
  }
]
```

We store the membership information directly on the Data Package's document like:

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

_Note: We actually already do this so this demo isn't so much about changing what we store but how we query._

Then, if we know a package ID, we can use a Solr join to query for the package members directly:

```
?q={!join from=members to=id}id:P1
```

Or if we simply want to find the package(s) a given metadata ID is a member of:

```
?q=members:M1
```

**Benefits:**

- Indexing a Data Package doesn't cause other Solr documents to be updated. This should dramatically decrease total time to index a Data Package and all its members
- It's much easier to find non-obsoleted packages. The current method involves multiple queries and is slow.

**Downsides:**

- Probably a bunch I'm not considering, specifically about rewriting most of our search UI
- I'm not sure how this compares performance-wise. In minimal testing, it's "fast enough"

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
