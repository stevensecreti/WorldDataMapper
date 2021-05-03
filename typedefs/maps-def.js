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