module.exports = ({excludeValue}) => {

  // words inside line should be uniq by line
  const values = [
    "Ad officia qui elit consectetur sint".split(' '),
    "Magna enim mollit proident irure Lorem aute adipisicing culpa".split(' '),
    "Ex occaecat quis ex minim consequat anim commodo pariatur".split(' '),
    "Dolore aliqua aliqua dolor esse id id laborum sit cillum eu laboris".split(' '),
    "Amet fugiat ut reprehenderit".split(' ')
  ];

  let indexValue = null;

  if( typeof excludeValue === 'number' ) {

    do {
      indexValue = Math.floor( Math.random() * values.length );
    } while( indexValue === excludeValue );
  } else {

    indexValue = Math.floor( Math.random() * values.length );
  }

  const hydrate = values[ indexValue ];

  return [hydrate, indexValue];

};
