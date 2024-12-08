import React, { ReactElement, ReactNode, useState } from 'react'
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Box,
  Text,
} from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { queryNodesInEmacs } from '../util/webSocketFunctions'

export default interface SearchBarProps {
  websocket: any
  query: OrgRoamNode[]
  followBehavior: any
  setPreviewNode: any
}

export default function SearchBar(props: SearchBarProps) {
  const { websocket, query, followBehavior, setPreviewNode } = props
  let [searchString, setSearchString] = useState<String>('')
  const nodes = Object.entries(query)
    .filter(([_key, node]) => node.title.includes(searchString))
    .slice(0, 5)
  return (
    <>
      <Box
        w="50%"
        margin="3px"
        zIndex={5}
        backgroundColor="black"
        color="white"
        style={{ position: 'absolute', top: 0, right: '25%' }}
      >
        <InputGroup borderRadius={5} size="sm">
          <InputLeftElement pointerEvents="none" children={<Search2Icon />} />
          <Input
            type="text"
            placeholder="Search..."
            onChange={(event: any) => {
              setSearchString(event.target.value)
              queryNodesInEmacs(event.target.value, websocket)
            }}
          />
          <InputRightAddon p={0} border="none">
            <Button size="sm" borderLeftRadius={0} borderRightRadius={3.3}>
              Search
            </Button>
          </InputRightAddon>
        </InputGroup>
        <SearchRecommendations
          recommendations={nodes}
          followBehavior={followBehavior}
          setPreviewNode={setPreviewNode}
        />
      </Box>
    </>
  )
}

export default interface SearchRecommendationsProps {
  recommendations: String[]
  followBehavior: any
  setPreviewNode: any
}

export function SearchRecommendations(props: SearchRecommendationsProps) {
  const { recommendations, followBehavior, setPreviewNode } = props

  return recommendations.map(([_key, node]) => {
    return (
      <Recommendation node={node} setPreviewNode={setPreviewNode} followBehavior={followBehavior} />
    )
  })
}

export interface RecommendationProps {
  setPreviewNode: any
  followBehavior: any
  node: OrgRoamNode
}

class Recommendation extends React.Component {
  constructor(props: RecommendationProps) {
    super(props)
  }

  render() {
    return (
      <Box
        key={this.props.node.id}
        onClick={() => {
          this.props.setPreviewNode(this.props.node)
          // TODO: not working:
          this.props.followBehavior('zoom', this.props.node, 100, 100)
        }}
        _hover={{ bg: 'lightgray' }}
        padding="5px"
      >
        <Text>{this.props.node.title}</Text>
      </Box>
    )
  }
}
