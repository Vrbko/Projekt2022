var PhotoModel = require('../models/photoModel.js');

/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {

    /**
     * photoController.list()
     */
    list: function (req, res) {
        PhotoModel.find(function (err, photos) {
            const spawn = require('await-spawn')
            var bl;
            const main = async () => {
            try {
              bl = await spawn('python3', ['script.py'])
    
            console.log("tostring " + bl.toString())
            } catch (e) {
            console.log("exceptiuon " + e.stderr.toString())
            }
            console.log("bl:: " +bl);
            return res.json(photos);

            }

            
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }
          
            main();
            
        });
        
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }




            return res.json(photo);
        });
    },

    /**
     * photoController.create()
     */
    create: function (req, res) {
       // console.log(req.body);


        var photo = new PhotoModel({
			image : req.body.upload,
			username : req.body.username,
            uuid : req.body.uuid
        });

        photo.save(function (err, photo) {
            const spawn = require('await-spawn')
            var bl;
            const main = async () => {
            try {
              bl = await spawn('python3', ['script.py'])
    
            console.log("tostring " + bl.toString())
            } catch (e) {
            console.log("exceptiuon " + e.stderr.toString())
            }
            console.log("bl:: " +bl);
            return res.json(bl.toString());

            }

            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            }

            main();

        });
    },

    /**
     * photoController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.path = req.body.path ? req.body.path : photo.path;
			photo.username = req.body.username ? req.body.username : photo.username;
			photo.date = req.body.date ? req.body.date : photo.date;
			
            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },

    /**
     * photoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PhotoModel.findByIdAndRemove(id, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the photo.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
