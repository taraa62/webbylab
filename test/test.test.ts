import { bootstrap, stopServer } from '../src/main';
import { createReadStream } from 'fs';
import axios from 'axios';
import * as FormData from 'form-data';
import { getConnectionManager } from 'typeorm';

describe('file tests', () => {
  beforeAll(async () => {
    await bootstrap();

    await getConnectionManager().get().query('delete from film');
  }, 10000);

  afterAll(async () => {
    await stopServer();
  });

  test('add films from file', async () => {
    const file = createReadStream('./test/films/1.txt');

    const form_data = new FormData();
    // @ts-ignore
    form_data.append('file', createReadStream(file.path));

    const request_config = {
      headers: {
        Authorization: 'Bearer 12345',
        'Content-Type': 'multipart/form-data',
      },
      data: form_data,
    };

    const res = await axios
      .post('http://localhost:8082/film/upload-list', form_data, request_config)
      .catch((er) => er);

    expect(res.data).toHaveProperty('status', 'ok');
  }, 20000);

  test('add film', async () => {
    const res = await axios({
      method: 'PUT',
      url: 'http://localhost:8082/film',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 12345',
      },
      data: {
        name: 'Godzilla',
        year: '2010',
        format: 'DVD',
        actors: 'Mel Brooks, Clevon Little',
      },
    });
    expect(res.data).toHaveProperty('status', 'ok');
  });
  test('delete film', async () => {
    const find = await axios.get('http://localhost:8082/find/name/Godzilla');
    expect(find.data).toHaveProperty('length', 1);

    const res = await axios({
      method: 'DELETE',
      url: 'http://localhost:8082/film/' + find.data[0].id,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 12345',
      },
    });
    expect(res.data).toHaveProperty('status', 'ok');

    const reFind = await axios.get('http://localhost:8082/find/name/Godzilla');
    expect(reFind.data).toHaveProperty(
      'message',
      'Sorry, we found nothing for you :(',
    );
  });

  test('get a list of films', async () => {
    const find = await axios.get('http://localhost:8082/find/list');

    expect(find.data).toHaveLength(25);
    expect(find.data[0]).toHaveProperty('name', '2001');
  });
  test('get films by name', async () => {
    const find = await axios.get('http://localhost:8082/find/name/Charade');

    expect(find.data).toHaveLength(1);
    expect(find.data[0]).toHaveProperty('year', 1953);
  });
  test('get films by actors', async () => {
    const find = await axios.get('http://localhost:8082/find/actor/ki');

    expect(find.data).toHaveLength(3);
    expect(find.data[0]).toHaveProperty('name', 'Real Genius');
  });
});
