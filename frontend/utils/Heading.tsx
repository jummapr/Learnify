interface HeadingProps {
    title: string;
    description: string;
    keyword: string;
}

const Heading: React.FC<HeadingProps> = ({description,keyword,title}) => {
  return (
    <>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="description" content={description}/>
        <meta name="keyword" content={keyword} />
    </>
  )
}

export default Heading