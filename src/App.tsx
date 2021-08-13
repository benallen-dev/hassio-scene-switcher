import React from 'react';
import './App.css';

import axios from 'axios';

const bearerToken = '';
const hassioInstance = 'raspi.local:8123';

// This is an interface because it's only a partial definition of a datum, but it's all the bits I need
interface Datum {
  entity_id: string;
  attributes: {
    friendly_name: string;
    id: string;
  }
}

// This is a type because this is what it should be, no more or less
type SceneInfo = {
  entity_id: string;
  friendly_name: string;
  id: string;
}

function App() {
  const [scenes, setScenes] = React.useState<SceneInfo[]>([]);

  React.useEffect(() => {
    axios({
      method: 'get',
      url: `http://${hassioInstance}/api/states`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: bearerToken
      }
    }).then(result => {
      const filteredData = result.data.reduce((acc: SceneInfo[], datum: Datum) => {
        if (datum.entity_id.startsWith('scene')) {
          acc.push({
            id: datum.attributes.id,
            entity_id: datum.entity_id,
            friendly_name: datum.attributes.friendly_name,
          });
        }

        return acc;
      }, []);

      const sortedData = filteredData.sort((a: SceneInfo, b: SceneInfo) => {
        return a.friendly_name < b.friendly_name ? -1 : 1;
      })

      setScenes(sortedData);
    }).catch((err) => {
      console.error(err);
    });
  }, [setScenes]);

  const sendSceneCmd = async (entity_id: string, transition: number) => {
    await axios({
      method: 'post',
      url: `http://${hassioInstance}/api/services/scene/turn_on`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: bearerToken
      },
      data: {
        entity_id,
        transition
      }
    });
  }

  return (
    <div className="App">
      <div className='App-grid-container'>
        {scenes.length > 0 && scenes.map(scene => (
          <button
            key={scene.id}
            onClick={() => sendSceneCmd(scene.entity_id, 2)}
            className='App-grid-scenebutton'
          >
            {scene.friendly_name}
          </button>
        ))}
      </div>

    </div>
  );
}

export default App;
