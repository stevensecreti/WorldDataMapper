const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		id: Int!
		name: String!
		owner: String!
		regions: [Int]
	}

	type Region {
		_id: String!
		id: Int!
		name: String!
		owner: String!
		subregions: [Int]
		leader:  String!
		capital: String!
		flag: String!
		landmarks: [String]
		parentRegion: String!
	}
	extend type Query {
		getAllMaps: [Map]
		getAllRegions: [Region]
		getMapById(_id: String!): Map
		getRegionById(id: Int!): Region 
	}

	extend type Mutation{
		addMap(map: MapInput!): String
		deleteMap(_id: String!): Boolean
		renameMap(_id: String!, name: String!): Boolean
		addRegion(region: RegionInput!): String
		addSubregion(_id: String!, region: Int!, map: Boolean!): Boolean
		updateRegionField(_id: String!, field: Int!, value: String!): Boolean
		deleteRegion(_id: String!): Boolean
		deleteSubregion(_id: String!, id: Int!, map: Boolean!, index: Int!): Boolean
		pushSort(_id: String!, ids: [Int], map: Boolean!): Boolean
		addLandmark(_id: String!, landmark: String!, code: Int!): Boolean
		deleteLandmark(_id: String, landmark: Int!, name: String!, code: Int!): Boolean
		renameLandmark(_id: String, landmark: Int!, name: String!): Boolean
		changeParent(_id: String!, new_parent: String!): Boolean
	}

	input FieldInput {
		_id: String
		field: String
		value: String
	}


	input MapInput {
		_id: String
		id: Int
		name: String
		owner: String
		regions: [Int]
	}

	input RegionInput {
		_id: String
		id: Int
		name: String
		owner: String
		subregions: [Int]
		leader:  String
		capital: String
		flag: String
		landmarks: [String]
		parentRegion: String
	}
`;

module.exports = { typeDefs: typeDefs }