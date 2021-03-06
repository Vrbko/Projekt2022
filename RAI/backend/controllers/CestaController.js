var CestaModel = require('../models/CestaModel.js');
var scrapperModel = require('../models/scrapperModel');

const axios = require("axios")
const cheerio = require("cheerio")

/**
 * CestaController.js
 *
 * @description :: Server-side logic for managing Cestas.
 */
module.exports = {

    /**
     * CestaController.list()
     */
    list: function (req, res) {
        CestaModel.find(function (err, Cestas) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Cesta.',
                    error: err
                });
            }
            var temp = []
            Cestas = Cestas.filter((item) => {
                if (!temp.includes(item.latitude)) {
                    temp.push(item.latitude)
                    return true;
                }
            })

            return res.json(Cestas);
        });
    },

    listScrapper: function (req, res) {
        scrapperModel.find(function (err, scrapper) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting scrapped info.',
                    error: err
                });
            }

            return res.json(scrapper);
        }).limit(1);
        //to pol spremen
    },

    scrape: function (req, res) {
        //return res.render('index', {title: 'Express'});

        const url = "https://www.24ur.com/novice/ceste"

        axios(url)
            .then(response => {
                const html = response.data
                //console.log(html)
                const $ = cheerio.load(html)

                let roadInfos = []

                //sam spodn table
                //$('div.table-wrapper.table-rounded.table-scroll-y').find("tr").each((idx, ref) => {

                //oba table
                $('table').find("tr").each((idx, ref) => {
                    const elem = $(ref);
                    const splitElem = elem.text().split(',')
                    const road = splitElem[0]
                    //brezveze splitat, ker so nekonstantni podatki (kagdaj ni oznake ceste al pa vejca fali...)
                    //al pa bi mogu z regexom preverjat

                    //ustvari objekt
                    /*var roadInfo = new scrapperModel({
                        info: elem.text(),
                        date: Date.now(),
                    });*/

                    roadInfos.push(elem.text())

                    //console.log(roadInfo)

                    //shrani v bazo
                    /*roadInfo.save(function (err, roadInfo) {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({
                                message: 'Error when creating roadInfo',
                                error: err
                            });
                        }
                        return res.status(201).json(roadInfo);
                    });*/

                    //console.log(elem.text())
                });
                //console.log(roadInfos)
               // console.log(roadInfos)

                var roadInfo = new scrapperModel({
                    info: roadInfos,
                    date: Date.now(),
                });

                if (roadInfos.length > 10) {
                    roadInfo.save(function (err, roadInfo) {
                        if (err) {
                            console.log(err)
                            return res.status(500).json({
                                message: 'Error when creating roadInfo',
                                error: err
                            });
                        }
                        return res.status(201)//.json(roadInfo);
                    })
                }

               // console.log(roadInfo)
               // console.log(roadInfos.length)

            }).catch(err => console.log(err))

        return res.render('index', {title: 'Express'});
    },

    /**
     * CestaController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CestaModel.findOne({_id: id}, function (err, Cesta) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Cesta.',
                    error: err
                });
            }

            if (!Cesta) {
                return res.status(404).json({
                    message: 'No such Cesta'
                });
            }

            return res.json(Cesta);
        });
    },

    /**
     * CestaController.create()
     */
    create: function (req, res) {
        console.log(req.body.latitude + "  , ", req.body.longitude + "  id: ", req.body.uid);
        var Cesta = new CestaModel({
            longitude: req.body.longitude,
            latitude: req.body.latitude,

            accelerationX: req.body.accelX,
            accelerationY: req.body.accelY,
            accelerationZ: req.body.accelZ,

            gyroscopeX: req.body.gyroX,
            gyroscopeY: req.body.gyroY,
            gyroscopeZ: req.body.gyroZ,
            timeStamp: new Date(),
            user_id: req.body.user_id,

            uniqueID: req.body.uid
        });

        Cesta.save(function (err, Cesta) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Error when creating Cesta',
                    error: err
                });
            }

            return res.status(201).json(Cesta);
        });
    },

    /**
     * CestaController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CestaModel.findOne({_id: id}, function (err, Cesta) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Cesta',
                    error: err
                });
            }

            if (!Cesta) {
                return res.status(404).json({
                    message: 'No such Cesta'
                });
            }

            Cesta.Longitude = req.body.Longitude ? req.body.Longitude : Cesta.Longitude;
            Cesta.Latitude = req.body.Latitude ? req.body.Latitude : Cesta.Latitude;
            Cesta.Altitude = req.body.Altitude ? req.body.Altitude : Cesta.Altitude;
            Cesta.user_id = req.body.user_id ? req.body.user_id : Cesta.user_id;

            Cesta.save(function (err, Cesta) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Cesta.',
                        error: err
                    });
                }

                return res.json(Cesta);
            });
        });
    },  
    session: function (req, res) {
        var id = req.params.id;
         CestaModel.find({uniqueID: id},function (err, session) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting session info.',
                    error: err
                });
            }
            return res.json(session);
        });
        
    },
    sessionLast: function (req, res) {
        CestaModel.findOne({}, {}, { sort: { 'timeStamp' : -1 } }, function(err, post) {
            console.log( post.uniqueID );

 
            CestaModel.find({uniqueID: post.uniqueID},function (err, session) {
               if (err) {
                   return res.status(500).json({
                       message: 'Error when getting session info.',
                       error: err
                   });
               }
               return res.json(session);
           });



          });

 
 
        
    },
     sessions: function (req, res) {
        var id = req.params.id;
        console.log(id);
         CestaModel.find({user_id: id},function (err, sessions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting sessions info.',
                    error: err
                });
            }
            var temp = []
            sessions = sessions.filter((item) => {
                if (!temp.includes(item.uniqueID)) {
                    temp.push(item.uniqueID)
                    return true;
                }
            })
           // console.log(sessions);
           return res.json(sessions);
        });
       
    },

    /**
     * CestaController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CestaModel.findByIdAndRemove(id, function (err, Cesta) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Cesta.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
