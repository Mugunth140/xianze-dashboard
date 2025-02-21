// src/app/api/registrations/[id]/route.js
import dbConnect from '../../../lib/mongodb';  // Adjusted path
import Registration from '../../../../models/Registration';  // Adjusted path

export async function GET(request, { params }) {
  await dbConnect();
  try {
    const registration = await Registration.findById(params.id);
    if (!registration) {
      return Response.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: registration });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const body = await request.json();
    const registration = await Registration.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!registration) {
      return Response.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: registration });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const deletedRegistration = await Registration.findByIdAndDelete(params.id);
    if (!deletedRegistration) {
      return Response.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: {} });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}