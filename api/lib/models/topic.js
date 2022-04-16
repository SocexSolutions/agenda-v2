const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const logger = require('@starryinternet/jobi');

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    meeting_id: {
      type: Schema.Types.ObjectId, ref: 'Meeting',
      required: true
    },
    likes: [ String ],
    status: {
      type: String,
      default: 'open',
      required: true
    }
  },
  {
    timestamp: true
  }
);

/**
 * Performs a bulk write operation that deletes topics present in db but not
 * in the savedTopics, created new topics if none exist in the database with a
 * matching _id and updates topics that have a matching _id.
 *
 * @param {Object|string} opts.meeting_id - meeting related to topics
 * @param {Object[]} opts.savedTopics     - topics objects to save
 *
 * @returns {Promise<Object[]>} - meeting's associated topics after save
 */
async function saveMeetingTopics({ meeting_id, savedTopics }) {
  logger.debug(`#saveMeetingTopics models/topic`);

  const writeOperations = [];

  const existingTopics = await this.find({ meeting_id });

  logger.debug( `found ${ existingTopics.length } existing topics` );

  const savedTopicIds = savedTopics.map( topic => {
    return topic._id ? topic._id.toString() : null;
  });

  existingTopics.forEach( ({ _id }) => {
    if ( !savedTopicIds.includes( _id.toString() ) ) {
      logger.debug( `deleting topic with _id: ${ _id }` );
      writeOperations.push({ deleteOne: { filter: { _id } } });
    }
  });

  const formattedTopics = savedTopics.map( topic => {
    return {
      _id: topic._id || undefined,
      name: topic.name,
      description: topic.description,
      meeting_id,
      likes: topic.likes || []
    };
  });

  formattedTopics.forEach( topic => {
    if ( !topic._id ) {
      logger.debug( `inserting topic with _id: ${ topic._id }` );
      writeOperations.push({ insertOne: { document: topic } });
    } else {
      logger.debug( `updating topic with _id: ${ topic._id }` );
      writeOperations.push({
        updateOne: {
          filter: { _id: topic._id },
          update: { $set: topic }
        }
      });
    }
  });

  await this.bulkWrite( writeOperations );

  return await this.find({ meeting_id });
}

topicSchema.statics.saveMeetingTopics = saveMeetingTopics;

module.exports = mongoose.model( 'Topic', topicSchema );
