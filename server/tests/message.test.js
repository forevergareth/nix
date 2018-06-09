const expect = require('expect')
const {makeMessage} = require('./../utils/message')

describe('Generate Message', () => {
  it('Should generate an object message', () => {
    let from = "Gareth"
    let text = " Some Test Text."
    let message = makeMessage(from, text);
    
    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({from, text});


  })
}) 