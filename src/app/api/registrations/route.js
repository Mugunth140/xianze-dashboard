// app/api/registrations/route.js
import dbConnect from '../../lib/mongodb';
import Registration from '../../../models/Registration';

export async function GET() {
  await dbConnect();
  try {
    const registrations = await Registration.find({});
    return Response.json({ success: true, data: registrations });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const registration = await Registration.create(body);
    return Response.json({ success: true, data: registration }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}