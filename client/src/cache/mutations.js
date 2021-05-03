import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			firstName
			lastName
			password
			initials
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
		register(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
			email
			password
			firstName
			lastName
		}
	}
`;

export const UPDATE = gql`
	mutation Update($email: String!, $password: String!, $firstName: String!, $lastName: String!, $_id: String!){
		update(email: $email, password: $password, firstName: $firstName, lastName: $lastName, _id: $_id)
	}
`;



export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const ADD_MAP = gql`
	mutation AddMap($map: MapInput!){
		addMap(map: $map)
	}
`;

export const DELETE_MAP = gql`
	mutation DeleteMap($_id: String!){
		deleteMap(_id: $_id)
	}
`;

export const RENAME_MAP = gql`
	mutation RenameMap($_id: String!, $name: String!){
		renameMap(_id: $_id, name: $name)
	}
`;

export const ADD_REGION = gql`
	mutation AddRegion($region: RegionInput!){
		addRegion(region: $region)
	}
`;

export const ADD_SUBREGION = gql`
	mutation AddSubregion($_id: String!, $region: Int!, $map: Boolean!){
		addSubregion(_id: $_id, region: $region, map: $map)
	}
`;