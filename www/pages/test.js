import Input  from '../components/Input/Input';
import Button from '../components/Button/Button';


const Test = () => {
  const saveFile = async( blob ) => {
    const reader = new FileReader();

    reader.onload = async e => {
      const CHUNK_SIZE  = 5000;
      const chunk_count = e.target.result.byteLength / CHUNK_SIZE;

      const fileName = Math.random() * 1000 + 'request.txt';
      for ( let chunk_id = 0; chunk_id < chunk_count + 1; chunk_id++ ) {
        const chunk = e.target.result.slice(
          chunk_id * CHUNK_SIZE,
          chunk_id * CHUNK_SIZE + CHUNK_SIZE
        );

        await fetch( 'http://localhost:4000/attachment', {
          'method': 'POST',
          'headers': {
            'content-type': 'application/octet-stream',
            'content-length': chunk.length,
            'file-name': fileName
          },
          'body': chunk
        });
      }
    };

    reader.readAsArrayBuffer( blob );
  };

  return (
    <div>
      <label>Add File</label>
      <Input
        type="file"
        onChange={ e => saveFile( e.target.files[ 0 ] ) }
      ></Input>
      <Button
        text='Submit'
        size='xs'
        onClick={() => console.log('test')}
      >
        Save File
      </Button>
    </div>
  );
};

export default Test;
