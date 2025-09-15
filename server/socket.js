

import DeliveryAssignment from "./models/deliveryAssignment.model.js";
import User from "./models/user.model.js";



export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log(socket.id)

    socket.on("identify", async ({ userId }) => {
      try {
        if (!userId) return;
      
        await User.findByIdAndUpdate(userId, { socketId: socket.id, isOnline: true });
        socket.join(`user_${userId}`);
      } catch (err) {
        console.error("socket identify error", err);
      }
    });

  
    socket.on("joinOrder", (orderId) => {
      if (!orderId) return;
      socket.join(`order_${orderId}`);
    });


    socket.on("delivery:location:update", async ({ assignmentId, latitude, longitude }) => {
      try {
        if (!assignmentId) return;
        const assignment = await DeliveryAssignment.findById(assignmentId).populate("order");
        if (!assignment) return;
      
        io.to(`order_${assignment.order._id}`).emit("delivery:location:live", {
          assignmentId,
          latitude,
          longitude,
          at: new Date()
        });
       
      } catch (err) {
        console.error("delivery:location:update error", err);
      }
    });

    socket.on("disconnect", async () => {
      try {
        
        await User.findOneAndUpdate({ socketId: socket.id }, { isOnline: false, socketId: null });
      } catch (err) { /* ignore */ }
    });
  });
}
