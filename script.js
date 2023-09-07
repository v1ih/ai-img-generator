const apiKey = "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"

const maxImages = 4
let selectedImageNumber = null

//gerar número aleatório entre o mínimo e máximo - função 
function getRandomNumber(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// desabiltar o botão de gerar durante o processamento - função 
function disableGenerateButton() {
    document.getElementById("generate").disabled = true 
}

// habilitar o botão de gerar após o processamento - função 
function enableGenerateButton() {
    document.getElementById("generate").disabled = false 
}

// limpar a grid - função 
function clearImageGrid() {
    const imageGrid = document.getElementById("image-grid")
    imageGrid.innerHTML = "";
}

// gerar as imagens - função 
async function generateImages(input) {
    disableGenerateButton()
    clearImageGrid()

    const loading = document.getElementById("loading")
    loading.style.display = "block"

    const imageUrls = []
    
    for(let i = 0; i < maxImages; i++){
        //gerar um número aleatório entre 1 e 10000 e aplicar no prompt
        const randomNumber = getRandomNumber(1, 100)
        const prompt = `${input} ${randomNumber}`
        //número aleatório adicionado ao prompt para gerar resultados diferentes 
        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({ inputs: prompt}),
            }
        );

        if(!response.ok){
            alert("Failed to generate image!")
        }

        const blob = await response.blob()
        const imgUrl = URL.createObjectURL(blob)
        imageUrls.push(imgUrl);

        const img = document.createElement("img")
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButton()

    selectedImageNumber = null // reseta imagem selecionada 
}

document.getElementById("generate").addEventListener('click', () => {
    const input = document.getElementById("user-prompt").value;
    generateImages(input)
});

function downloadImage(imgUrl, imageNumber){
    const link = document.createElement("a");
    link.href = imgUrl
    // seleciona nome do arquivo baseado na imagem selecionada 
    link.download = `image-${imageNumber + 1}.jpg`
    link.click()
}