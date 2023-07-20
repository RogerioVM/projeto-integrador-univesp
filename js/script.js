var addressInput = document.getElementById('address-input');
        var showChartBtn = document.getElementById('show-chart-btn');
        var map;

        // Inicializa o mapa
        window.addEventListener('DOMContentLoaded', function() {
            map = L.map('map').setView([0, 0], 13); // Define a visualização inicial do mapa
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { // Usa o OpenStreetMap como camada base
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                maxZoom: 18
            }).addTo(map);
        });

        function showAddress() {
            var address = addressInput.value;

            if (address.trim() !== '') {
                // Limpa a camada anterior com o endereço
                map.eachLayer(function (layer) {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });

                // Mostra o novo endereço no mapa
                var geocodeUrl = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(address);
                fetch(geocodeUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data.length > 0) {
                            var lat = parseFloat(data[0].lat);
                            var lon = parseFloat(data[0].lon);
                            var marker = L.marker([lat, lon]).addTo(map);
                            marker.bindPopup('Endereço: ' + address).openPopup();
                            map.setView([lat, lon], 13);
                        } else {
                            alert('Não foi possível encontrar o endereço no mapa.');
                        }
                    });

                showChartBtn.style.display = 'block'; // Mostrar botão "Mostrar Gráfico"
            }
        }

        function showChart() {
            var addresses = localStorage.getItem('addresses');

            if (addresses) {
                localStorage.setItem('addresses', addresses + ',' + addressInput.value);
            } else {
                localStorage.setItem('addresses', addressInput.value);
            }

            window.location.href = 'chart.html';
        }

        //Relátórios estátisticos

        var addresses = localStorage.getItem('addresses');

        if (addresses) {
            var addressCounts = {};
            var addressesArray = addresses.split(',');

            addressesArray.forEach(function (address) {
                var region = address.trim().toLowerCase();
                if (region in addressCounts) {
                    addressCounts[region]++;
                } else {
                    addressCounts[region] = 1;
                }
            });

            var regions = Object.keys(addressCounts);
            var counts = Object.values(addressCounts);

            var ctx = document.getElementById('chart').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: regions,
                    datasets: [{
                        label: 'Contagem de Endereços por Região',
                        data: counts,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(153, 102, 255, 0.8)',
                            'rgba(255, 159, 64, 0.8)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            stepSize: 1
                        }
                    }
                }
            });

        } else {
            alert('Nenhum endereço foi inserido ainda.');
            goBack(); // Redirecionar para a página index.html
        }