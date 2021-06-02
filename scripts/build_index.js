var solr = require('solr-node');
require('log4js').getLogger('solr-node').level = 'DEBUG';

const n_pkgs = 100
const pkg_size = 100

// Create objects
var objects = new solr({
  host: '127.0.0.1',
  port: '8983',
  core: 'objects',
  protocol: 'http'
});

var relationships = new solr({
  host: '127.0.0.1',
  port: '8983',
  core: 'relationships',
  protocol: 'http'
});


const create_packages = async function () {
  console.log("create_packages")

  for (var i = 1; i < n_pkgs + 1; i++) {
    await create_package(i)
  }
}

const create_package = async function (index) {
  console.log("create_package" + index)

  package_id = `p${index}`

  data_ids = await create_data_json_for(package_id)
  metadata_id = await create_metadata_json_for(index)
  member_ids = [metadata_id, ...data_ids]
  await create_package_json_for(package_id, member_ids)
  await create_relationships_for(package_id, member_ids)
  await create_provenance_for(package_id, member_ids)
}

const create_relationships_for = async function (package_id, member_ids) {
  for (var i = 1; i < member_ids.length; i++) {
    relationship_json = {
      "package_id": package_id,
      "type": "PACKAGING",
      "subject": package_id,
      "predicate": "d1:hasMember",
      "object": member_ids[i]
    }

    await relationships.update(relationship_json)
  }
}
const create_provenance_for = async function (package_id, member_ids) {
  for (var i = 1; i < member_ids.length; i++) {
    provenance_json = {
      "package_id": package_id,
      "type": "PROVENANCE",
      "subject": package_id,
      "predicate": "prov:uses",
      "object": member_ids[i]
    }

    await relationships.update(provenance_json)
  }
}

const create_metadata_json_for = async function (index) {
  const id = `m${index}`
  console.log("create_metadata" + id)

  metadata_json = {
    "id": id,
    "type": "METADATA",
    "name": `Metadata for dataset m${index}.`,
    "format": "application/json"
  }

  await objects.update(metadata_json)

  return id
}

const create_package_json_for = async function (package_id, members) {
  const package_json = {
    "id": package_id,
    "type": "PACKAGE",
    "members": members
  }

  await objects.update(package_json)

  return package_id
}

const create_data_json_for = async function (package_id) {
  let data_ids = []

  for (var i = 1; i < pkg_size + 1; i++) {
    data_ids.push(`${package_id}d${i}`)
  }

  const data_json = data_ids.map((id) => {
    return {
      "id": id,
      "type": "DATA",
      "name": `Data file ${id}`,
      "format": "text/plain"
    }
  });

  for (var i = 1; i < data_json.length; i++) {
    await objects.update(data_json[i])
  }

  return data_ids
}

console.log("build_index")






const main = async function () {
  await create_packages()
  await objects.commit()
}

main()
