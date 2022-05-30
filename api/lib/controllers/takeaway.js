const Takeaway  = require('../models/takeaway');
const Topic     = require('../models/topic');
const authUtils = require('../util/authorization');

module.exports = {
  create: async( req, res ) => {
    const { name, description, topic_id } = req.body;

    const { meeting_id } = await Topic.findOne({ _id: topic_id });

    await authUtils.checkParticipant( meeting_id, req.credentials );

    const takeaway = await Takeaway.create({
      name,
      description,
      topic_id,
      owner_id: req.credentials.sub
    });

    res.status( 201 ).send( takeaway );
  },

  update: async( req, res ) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const subject_id = req.credentials.sub;

    await authUtils.checkOwner( id, 'takeaways', req.credentials );

    const updatedTakeaway = await Takeaway.findOneAndUpdate(
      { _id: id },
      { name, owner_id: subject_id, description  },
      { new: true }
    );

    res.status( 200 ).send( updatedTakeaway );
  },

  delete: async( req, res ) => {
    const { id } = req.params;

    await authUtils.checkOwner( id, 'takeaways', req.credentials );

    const deleted = await Takeaway.deleteOne({
      _id: id
    });

    res.status( 200 ).send( deleted );
  }
};
