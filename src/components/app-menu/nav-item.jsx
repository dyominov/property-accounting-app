import NextLink from 'next/link';
import path from 'path';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Button, MenuItem, Typography } from '@mui/material';
import FiberManualRecordTwoToneIcon from '@mui/icons-material/FiberManualRecordTwoTone';

export const NavItem = (props) => {
  const { href, title, hasSelected, ...others } = props;
  
  const router = useRouter();
  const { base } = path.parse(href);

  const active = href ? (
    base.length > 0 && router.asPath.includes(base)) || (base === '' && (router.asPath.includes('document') || router.asPath === '/')
    ) : false;

  return (
    <MenuItem
      disableGutters
      sx={{
        display: 'flex',
      }}
      {...others}
    >
      <NextLink
        href={href}
        passHref
      >
        <Button
          sx={{
            color: active ? 'neutral.400' : 'primary.contrastText',

            '&:hover': {
              backgroundColor: 'rgba(255,255,255, 0.08)'
            },
            position: 'relative'
          }}
        >
          <Typography textAlign="center">
            {title}
          </Typography>
          {hasSelected && <FiberManualRecordTwoToneIcon sx={{ fontSize: '9px', position: 'absolute', right: '8px', top: '10px' }} color='error' />}
        </Button>
      </NextLink>
    </MenuItem>
  );
};

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string,
  hasSelected: PropTypes.bool,
};
