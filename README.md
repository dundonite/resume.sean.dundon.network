# Résuménder, a résumé renderer

A [jsonresume.org](https://jsonresume.org) resume, rendered in HTML by [Resumed](https://www.npmjs.com/package/resumed), printed to PDF with [Puppetteer](https://pptr.dev), converted to docx with [pandoc](https://pandoc.org), built in Docker and deployed to Github Pages. Can be seen live at https://resume.sean.dundon.network.

# How to Use

## Build Resume Documents

1. Place your resume.json into src/
1. (Optional) Place a photo into src/ and include the filename in basics.image attribute.
1. Build and run the docker container
1. Find artifacts in out/

```
cp ~/resume.json src/
docker build -t resumender .
docker run --rm -v $(pwd)/src:/usr/src/app/src -v $(pwd)/out:/usr/src/app/out resumender
$ ls out/
index.html  resume.docx  resume.json  resume.pdf
```

## (Optional) Publish to Github pages

1. Create a new Github repository
1. In your repository change "Settings -> Pages -> Build and deployement -> Source" to "GitHub Actions"
1. Update the Git origin URL
1. Commit and push your changes.

# To Do

- [ ] Spell and grammar checks during build
- [ ] Better docx format (custom reference.docx for pandoc?)s