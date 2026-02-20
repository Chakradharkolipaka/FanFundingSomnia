import abi from '../../contracts/abi.json';

import { getSelectedContractAddress } from "./networks";

export const contractAddress = getSelectedContractAddress();
export const contractAbi = abi;
