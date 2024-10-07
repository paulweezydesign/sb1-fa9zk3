import { MongoClient, ObjectId } from 'mongodb';
import { verifyToken } from '../utils/auth';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  const userId = await verifyToken(req);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await client.connect();
    const database = client.db('myapp');
    const todos = database.collection('todos');

    switch (req.method) {
      case 'GET':
        const userTodos = await todos.find({ userId: new ObjectId(userId) }).toArray();
        res.status(200).json(userTodos);
        break;

      case 'POST':
        const { text } = req.body;
        const newTodo = {
          text,
          completed: false,
          userId: new ObjectId(userId),
          createdAt: new Date(),
        };
        const result = await todos.insertOne(newTodo);
        res.status(201).json({ ...newTodo, _id: result.insertedId });
        break;

      default:
        res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Todos error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await client.close();
  }
}