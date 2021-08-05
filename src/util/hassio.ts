import axios, { AxiosResponse } from 'axios';

export const fetchScenes = async () => {
  const result = await axios({
    url: 'http://raspi.local:8123/api/states',
    method: 'get',
    headers: {
      // 'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIxZmJiMjI1NTYzMmM0ODA5OWU5Y2VmZjUyNzY0NTZmMSIsImlhdCI6MTYyNzMwMTA4OSwiZXhwIjoxOTQyNjYxMDg5fQ.2lJ3lxP90WMUKoc6RZtTSyG864_b8WMOiocSeKHZHYg',
    }
  });

  const scenes = result.data.reduce((acc: HassioScene[], item: HassioEntity) => {
    if (item.entity_id.startsWith('scene.')) {
      acc.push({
        scene: item.entity_id,
        friendly_name: item.attributes.friendly_name
      });
    }

    return acc;
  }, []);

  return scenes;
};

type HassioScene = {
  scene: string;
  friendly_name: string;
};

type HassioEntity = {
  entity_id: string;
  attributes: {
    [key:string]: string
  }
};
