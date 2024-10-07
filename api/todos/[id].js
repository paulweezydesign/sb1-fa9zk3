import { MongoClient, ObjectId } from 'mongodb';
import { verifyToken } from '../utils/auth';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  const userId = await verifyToken(req);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  try {
    await client.connect();
    const database = client.db('myapp');
    const todos = database.collection('todos');

    switch (req.method) {
      case 'PATCH':
        const { completed } = req.body;
        const updateResult = await todos.updateOne(
          { _id: new ObjectId(id), userId: new ObjectId(userId) },
          { $set: { completed } }
        );
        if (updateResult.matchedCount === 0) {
          res.status(404).json({ message: 'Todo not found' });
        } else {
          res.status(200).json({ message: 'Todo updated successfully' });
        }
        break;

      case 'DELETE':
        const deleteResult = await todos.deleteOne({
          _id: new ObjectId(id),
          userId: new ObjectId(userId),
        });
        if (deleteResult.deletedCount === 0) {
          res.status(404).json({ message: 'Todo not found' });
        } else {
          res.status(200).json({ message: 'Todo deleted successfully' });
        }
        break;

      default:
        res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Todo operation error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await client.close();
  }
}